import type { MetadataRoute } from 'next'
import {
  getAllCCNL,
  macrosettori,
  getAllGuideSlugs,
  getCCNLGuide,
  getAllPosts,
  getAllCategories,
} from '@/data/db'

const BASE_URL = 'https://www.contratticcnl.it'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Pagine statiche
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/ccnl`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/accordi`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/articoli`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/settori`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tabelle-retributive`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/livelli`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/pdf`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contatti`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]

  // Guide editoriali + sotto-pagine
  const guidePages: MetadataRoute.Sitemap = []
  for (const slug of getAllGuideSlugs()) {
    const guide = getCCNLGuide(slug)
    if (!guide) continue

    guidePages.push({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    })
    if (guide.livelli_html) {
      guidePages.push({
        url: `${BASE_URL}/${slug}/livelli`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
    if (guide.tabelle_html) {
      guidePages.push({
        url: `${BASE_URL}/${slug}/tabelle-retributive`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
    if (guide.preavviso_html) {
      guidePages.push({
        url: `${BASE_URL}/${slug}/preavviso`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
    if (guide.parametri_html) {
      guidePages.push({
        url: `${BASE_URL}/${slug}/parametri`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // 1032 CCNL
  const ccnlPages: MetadataRoute.Sitemap = getAllCCNL().map((ccnl) => ({
    url: `${BASE_URL}/ccnl/${ccnl.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 18 macrosettori
  const settorePages: MetadataRoute.Sitemap = macrosettori.map((m) => ({
    url: `${BASE_URL}/settore/${m.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Categorie blog
  const categoryPages: MetadataRoute.Sitemap = getAllCategories().map((cat) => ({
    url: `${BASE_URL}/articoli/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // 112 blog post
  const postPages: MetadataRoute.Sitemap = getAllPosts().map((post) => {
    const cat = post.categories[0]
    const url = cat
      ? `${BASE_URL}/${cat.slug}/${post.slug}`
      : `${BASE_URL}/${post.slug}`
    return {
      url,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }
  })

  return [
    ...staticPages,
    ...guidePages,
    ...ccnlPages,
    ...settorePages,
    ...categoryPages,
    ...postPages,
  ]
}
