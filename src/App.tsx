import { NavBar } from "./components/NavBar"
import { AboutSection } from "./sections/AboutSection"
import { BrandsSection } from "./sections/BrandsSection"
import { CaseStudiesSection } from "./sections/CaseStudiesSection"
import { HeroSection } from "./sections/HeroSection"
import { ImpactSection } from "./sections/ImpactSection"
import { OurMarketSection } from "./sections/OurMarketSection"
import { PartnersSection } from "./sections/PartnersSection"
import { ServicesSection } from "./sections/ServicesSection"
import { TestimoniesSection } from "./sections/TestimoniesSection"
import { ContactUsSection } from "./sections/ContactUsSection"
import { FooterSection } from "./sections/FooterSection"
import { ScrollToTop } from "./components/ScrollToTop"

function App() {
  return (
    <main className="app">
      <div className="relative">
        <NavBar />
        <HeroSection />
      </div>
      <BrandsSection />
      <AboutSection />
      <ServicesSection />
      <ImpactSection />
      <OurMarketSection />
      <CaseStudiesSection />
      <PartnersSection />
      <TestimoniesSection />
      <ContactUsSection />
      <FooterSection />
      <ScrollToTop />
    </main>
  )
}

export default App
