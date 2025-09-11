import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { Pricing } from "@/components/sections/pricing"
import { Testimonials } from "@/components/sections/testimonials"
import { Footer } from "@/components/sections/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
