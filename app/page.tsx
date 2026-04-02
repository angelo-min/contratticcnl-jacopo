import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/home/hero-section'
import { StatsSection } from '@/components/home/stats-section'
import { GuidesSection } from '@/components/home/guides-section'
import { SectorsSection } from '@/components/home/sectors-section'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <GuidesSection />
        <SectorsSection />
      </main>
      <Footer />
    </div>
  )
}
