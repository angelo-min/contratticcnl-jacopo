#!/usr/bin/env python3
"""
Extract editorial guide content from WordPress XML export.

Outputs:
  - data/xml-export/ccnl-guide/<slug>.json for all ~22 guide pages
  - data/xml-export/static-pages.json for cookie-policy, privacy-policy, disclaimer, contatti
  - Updates data/xml-export/blog-posts.json with content_html field
  - Downloads images to public/uploads/ (requires requests)
"""

import json
import os
import re
import sys
from html import escape as html_escape
from html.parser import HTMLParser
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False
    print("Warning: 'requests' not available — images will not be downloaded", file=sys.stderr)

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(SCRIPT_DIR)
XML_PATH = os.path.join(ROOT, 'ccnl.WordPress.2026-04-02.xml')
GUIDE_DIR = os.path.join(ROOT, 'data', 'xml-export', 'ccnl-guide')
CATALOG_PATH = os.path.join(ROOT, 'data', 'xml-export', 'ccnl-catalog.json')
BLOG_POSTS_PATH = os.path.join(ROOT, 'data', 'xml-export', 'blog-posts.json')
STATIC_PAGES_PATH = os.path.join(ROOT, 'data', 'xml-export', 'static-pages.json')
PUBLIC_UPLOADS_DIR = os.path.join(ROOT, 'public', 'uploads')

# XML namespaces
NS = {
    'wp': 'http://wordpress.org/export/1.2/',
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'dc': 'http://purl.org/dc/elements/1.1/',
}

# Base URL of old WordPress site
BASE_URL = 'https://www.contratticcnl.it'
WP_UPLOADS_BASE = 'https://www.contratticcnl.it/wp-content/uploads/'

# Site utility pages — not guides
SKIP_SLUGS = {
    'accordi', 'articoli', 'contratti-ccnl', 'download', 'pdf',
    'settori', 'settore', 'cerca',
}

# Static informational pages (separate from guides)
STATIC_SLUGS = {'contatti', 'cookie-policy', 'disclaimer', 'privacy-policy'}

# Valid subpage types
SUBPAGE_TYPES = {'livelli', 'tabelle-retributive', 'preavviso', 'parametri'}

# ---------------------------------------------------------------------------
# HTML cleaner
# ---------------------------------------------------------------------------
_ALLOWED_TAGS = {
    'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li',
    'strong', 'em', 'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
    'blockquote', 'br',
}
_ALLOWED_ATTRS: dict[str, list[str]] = {
    'a': ['href'],
    'img': ['src', 'alt', 'width', 'height'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
}
# Tags whose content is kept but the tag itself is removed
_UNWRAP_TAGS = {
    'figure', 'div', 'span', 'section',
    'header', 'article', 'footer', 'main', 'aside', 'nav',
    'h1',  # h1 → convert to text (content passes through)
}
# Tags whose tag AND content are dropped
_DROP_TAGS = {
    'script', 'style', 'noscript', 'iframe',
    'input', 'button', 'form', 'svg', 'select', 'option', 'textarea',
    'figcaption',
}


class _HTMLCleaner(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.output: list[str] = []
        self.drop_depth = 0

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()

        if self.drop_depth > 0:
            if tag in _DROP_TAGS:
                self.drop_depth += 1
            return

        if tag in _DROP_TAGS:
            self.drop_depth = 1
            return

        # Unknown tags and unwrap-tags: skip the tag, let content through
        if tag in _UNWRAP_TAGS or tag not in _ALLOWED_TAGS:
            return

        attr_dict = dict(attrs)
        allowed_names = _ALLOWED_ATTRS.get(tag, [])
        result_attrs = []

        for name in allowed_names:
            val = (attr_dict.get(name) or '').strip()
            if not val:
                continue
            if name == 'src':
                val = val.replace(WP_UPLOADS_BASE, '/uploads/')
            elif name == 'href':
                if val.startswith(BASE_URL):
                    val = val[len(BASE_URL):] or '/'
            result_attrs.append((name, val))

        if result_attrs:
            attrs_str = ' '.join(f'{k}="{html_escape(v)}"' for k, v in result_attrs)
            self.output.append(f'<{tag} {attrs_str}>')
        else:
            if tag == 'img':
                return  # img without src is useless
            self.output.append(f'<{tag}>')

    def handle_endtag(self, tag):
        tag = tag.lower()
        if self.drop_depth > 0:
            if tag in _DROP_TAGS:
                self.drop_depth -= 1
            return
        if tag in _DROP_TAGS or tag in _UNWRAP_TAGS or tag not in _ALLOWED_TAGS:
            return
        if tag not in ('br', 'img'):
            self.output.append(f'</{tag}>')

    def handle_data(self, data):
        if self.drop_depth > 0:
            return
        self.output.append(html_escape(data, quote=False))

    def get_output(self):
        return ''.join(self.output)


def clean_html(raw):
    """Strip Gutenberg boilerplate and apply HTML whitelist."""
    if not raw:
        return ''

    # Strip Gutenberg block comments
    raw = re.sub(r'<!--\s*/?wp:[^>]*?-->', '', raw, flags=re.DOTALL)

    # Strip shortcodes [wpcode ...] and generic [...]
    raw = re.sub(r'\[/?[a-zA-Z_][^\]]*\]', '', raw)

    # Remove inline style= attributes before parsing (avoids false positives)
    raw = re.sub(r'\s+style="[^"]*"', '', raw)

    cleaner = _HTMLCleaner()
    cleaner.feed(raw)
    result = cleaner.get_output()

    # Collapse 3+ newlines → 2
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.strip()


# ---------------------------------------------------------------------------
# XML helpers
# ---------------------------------------------------------------------------

def get_postmeta(item, key):
    for meta in item.findall('wp:postmeta', NS):
        if meta.findtext('wp:meta_key', '', NS) == key:
            return (meta.findtext('wp:meta_value', '', NS) or '').strip()
    return ''


def get_content(item):
    elem = item.find('content:encoded', NS)
    return (elem.text or '') if elem is not None else ''


def url_segments(url):
    path = urlparse(url).path.rstrip('/')
    return [s for s in path.split('/') if s]


# ---------------------------------------------------------------------------
# CCNL catalog matching
# ---------------------------------------------------------------------------

_SLUG_KEYWORDS = {
    'agricoltura-florovivaisti': ['florovivaist', 'operai agricol'],
    'agricoltura-impiegati':     ['impiegati agric', 'quadri agric'],
    'autoferrotranvieri':        ['autoferrotranv'],
    'autoscuole':                ['autoscuol'],
    'bancari':                   ['bancari', 'aziende di credito'],
    'commercio':                 ['commercio', 'terziario e servizi'],
    'elettrico':                 ['elettric', 'elettricità'],
    'energia-petrolio':          ['energia', 'petrolio', 'chimica-farmaceut'],
    'enti-pubblici':             ['funzioni locali', 'enti locali'],
    'gomma-plastica':            ['gomma', 'plastica'],
    'lavoro-domestico':          ['colf', 'badant', 'lavoro domestico', 'domestici'],
    'metalmeccanici':            ['metalmeccanici', 'industria metalmec'],
    'multiservizi':              ['multiservizi'],
    'sanita':                    ['sanità', 'sanitario', 'sanita'],
    'studi-professionali':       ['studi professional', 'dipendenti studi'],
    'telecomunicazioni':         ['telecom', 'comunicaz'],
    'turismo':                   ['turismo', 'albergh', 'pubblici esercizi'],
    'vigilanza-privata':         ['vigilanza privata', 'servizi fiduciari'],
}


def _dipendenti(rec):
    try:
        return int((rec.get('n_dipendenti_tot_2023') or '0').replace('.', '').replace(',', ''))
    except Exception:
        return 0


def find_catalog_match(slug, catalog):
    keywords = _SLUG_KEYWORDS.get(slug, [slug.replace('-', ' ')])
    matches = []
    for rec in catalog:
        titolo_lower = rec['titolo'].lower()
        if any(kw.lower() in titolo_lower for kw in keywords):
            matches.append(rec)
    if not matches:
        return None
    matches.sort(key=_dipendenti, reverse=True)
    return matches[0]


def build_info(slug, catalog, existing_info):
    if existing_info:
        return existing_info

    rec = find_catalog_match(slug, catalog)
    if rec:
        return {
            'titolo': rec['titolo'],
            'settore': rec['settore_desc'],
            'contraenti_datoriali': rec['firmatari_datoriali'],
            'scadenza': rec['scadenza_contrattuale'],
            'codice_cnel': rec['id'],
            'data_stipula': '',
        }

    return {
        'titolo': slug.replace('-', ' ').title(),
        'settore': '',
        'contraenti_datoriali': '',
        'scadenza': '',
        'codice_cnel': '',
        'data_stipula': '',
    }


# ---------------------------------------------------------------------------
# Image downloader
# ---------------------------------------------------------------------------

def collect_image_urls(html):
    pattern = re.compile(r'https://www\.contratticcnl\.it/wp-content/uploads/([^\s"\'<>]+)')
    return set(pattern.findall(html))


def download_images(all_html):
    if not HAS_REQUESTS:
        return
    paths = set()
    for h in all_html:
        paths |= collect_image_urls(h)

    for img_path in sorted(paths):
        url = WP_UPLOADS_BASE + img_path
        local = os.path.join(PUBLIC_UPLOADS_DIR, img_path)
        if os.path.exists(local):
            print(f'  already exists: {img_path}')
            continue
        os.makedirs(os.path.dirname(local), exist_ok=True)
        try:
            resp = requests.get(url, timeout=15)
            if resp.status_code == 200:
                with open(local, 'wb') as f:
                    f.write(resp.content)
                print(f'  downloaded: {img_path}')
            else:
                print(f'  SKIP {url}: HTTP {resp.status_code}', file=sys.stderr)
        except Exception as exc:
            print(f'  ERROR {url}: {exc}', file=sys.stderr)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f'Parsing {XML_PATH} ...')
    tree = ET.parse(XML_PATH)
    channel = tree.getroot().find('channel')
    assert channel is not None

    catalog = json.load(open(CATALOG_PATH, encoding='utf-8'))
    blog_posts = json.load(open(BLOG_POSTS_PATH, encoding='utf-8'))

    # Load existing guide JSONs for info preservation
    existing_guides = {}
    if os.path.isdir(GUIDE_DIR):
        for fname in os.listdir(GUIDE_DIR):
            if fname.endswith('.json'):
                s = fname[:-5]
                existing_guides[s] = json.load(open(os.path.join(GUIDE_DIR, fname), encoding='utf-8'))

    # ---------------------------------------------------------------------------
    # Collect all published page items
    # ---------------------------------------------------------------------------
    pages = {}

    for item in channel.findall('item'):
        pt = item.find('wp:post_type', NS)
        if pt is None or pt.text != 'page':
            continue
        if item.findtext('wp:status', '', NS) != 'publish':
            continue
        link = item.findtext('link', '')
        if '?page_id=' in link:
            print(f'  skip (no slug): {link}', file=sys.stderr)
            continue
        segs = url_segments(link)
        if segs:
            pages[tuple(segs)] = item

    print(f'Published pages found: {len(pages)}')

    # Separate top-level vs subpages
    top_level = {}
    subpages = {}

    for segs, item in pages.items():
        if len(segs) == 1:
            top_level[segs[0]] = item
        elif len(segs) == 2 and segs[1] in SUBPAGE_TYPES:
            subpages[(segs[0], segs[1])] = item

    guide_slugs = sorted(
        s for s in top_level
        if s not in SKIP_SLUGS and s not in STATIC_SLUGS
    )
    static_slugs = sorted(s for s in top_level if s in STATIC_SLUGS)

    print(f'\nGuides ({len(guide_slugs)}): {guide_slugs}')
    print(f'Statics: {static_slugs}')

    os.makedirs(GUIDE_DIR, exist_ok=True)
    raw_html_for_images = []  # raw (uncleaned) HTML for image URL discovery

    # ---------------------------------------------------------------------------
    # Process guide pages
    # ---------------------------------------------------------------------------
    print('\n--- Guide pages ---')
    for guide_slug in guide_slugs:
        item = top_level[guide_slug]

        raw = get_content(item)
        raw_html_for_images.append(raw)
        content_html = clean_html(raw)

        def get_sub(sub_type):
            sub_item = subpages.get((guide_slug, sub_type))
            if sub_item is None:
                return None, None
            sub_raw = get_content(sub_item)
            raw_html_for_images.append(sub_raw)
            h = clean_html(sub_raw)
            t = sub_item.findtext('title', '') or None
            return h or None, t

        livelli_html, livelli_title = get_sub('livelli')
        tabelle_html, tabelle_title = get_sub('tabelle-retributive')
        preavviso_html, _ = get_sub('preavviso')
        parametri_html, _ = get_sub('parametri')

        page_title = item.findtext('title', guide_slug)
        seo_title = get_postmeta(item, '_yoast_wpseo_title') or page_title
        seo_desc = get_postmeta(item, '_yoast_wpseo_metadesc') or ''

        existing_info = existing_guides.get(guide_slug, {}).get('info')
        info = build_info(guide_slug, catalog, existing_info)

        # Preserve old text-only fields for backward compatibility (removed in Phase 3)
        old = existing_guides.get(guide_slug, {})

        guide_data: dict = {
            'slug': guide_slug,
            'title': page_title,
            'seo_title': seo_title,
            'seo_description': seo_desc,
            'info': info,
            # New HTML fields
            'content_html': content_html,
            'livelli_html': livelli_html,
            'livelli_title': livelli_title,
            'tabelle_html': tabelle_html,
            'tabelle_title': tabelle_title,
            'preavviso_html': preavviso_html,
            'parametri_html': parametri_html,
            # Old text fields — kept for now, removed after Phase 3
            'content': old.get('content', ''),
            'livelli': old.get('livelli', ''),
            'tabelle': old.get('tabelle', ''),
            'preavviso': old.get('preavviso', None),
        }

        out_path = os.path.join(GUIDE_DIR, f'{guide_slug}.json')
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(guide_data, f, ensure_ascii=False, indent=2)

        subs = []
        if livelli_html:
            subs.append(f'livelli={len(livelli_html)}')
        if tabelle_html:
            subs.append(f'tabelle={len(tabelle_html)}')
        if preavviso_html:
            subs.append(f'preavviso={len(preavviso_html)}')
        if parametri_html:
            subs.append(f'parametri={len(parametri_html)}')
        print(f'  {guide_slug}: content={len(content_html)} {", ".join(subs)}')

    # ---------------------------------------------------------------------------
    # Process static pages
    # ---------------------------------------------------------------------------
    print('\n--- Static pages ---')
    static_output = {}
    for slug in static_slugs:
        item = top_level[slug]
        raw = get_content(item)
        raw_html_for_images.append(raw)
        content_html = clean_html(raw)
        static_output[slug] = {
            'slug': slug,
            'title': item.findtext('title', slug),
            'content_html': content_html,
        }
        print(f'  {slug}: content={len(content_html)}')

    with open(STATIC_PAGES_PATH, 'w', encoding='utf-8') as f:
        json.dump(static_output, f, ensure_ascii=False, indent=2)

    # ---------------------------------------------------------------------------
    # Update blog-posts.json
    # ---------------------------------------------------------------------------
    print('\n--- Blog posts ---')
    post_items = {}
    for item in channel.findall('item'):
        pt = item.find('wp:post_type', NS)
        if pt is None or pt.text != 'post':
            continue
        if item.findtext('wp:status', '', NS) != 'publish':
            continue
        slug = item.findtext('wp:post_name', '', NS) or ''
        if slug:
            post_items[slug] = item

    updated = []
    matched = 0
    for post in blog_posts:
        slug = post['slug']
        if slug in post_items:
            raw = get_content(post_items[slug])
            post_copy = {**post, 'content_html': clean_html(raw)}
            matched += 1
        else:
            post_copy = {**post, 'content_html': ''}
        updated.append(post_copy)

    with open(BLOG_POSTS_PATH, 'w', encoding='utf-8') as f:
        json.dump(updated, f, ensure_ascii=False, indent=2)

    print(f'  Updated {len(updated)} posts ({matched} with HTML content)')

    # ---------------------------------------------------------------------------
    # Download images (from raw HTML before URL rewriting)
    # ---------------------------------------------------------------------------
    print('\n--- Images ---')
    # Also collect from blog posts raw content
    for post in blog_posts:
        slug = post['slug']
        if slug in post_items:
            raw_html_for_images.append(get_content(post_items[slug]))
    download_images(raw_html_for_images)

    print('\nDone.')


if __name__ == '__main__':
    main()
