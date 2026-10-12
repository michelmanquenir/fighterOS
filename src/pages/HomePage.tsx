import { CalendarioNacionalSection } from '../features/landing/components/CalendarioNacionalSection'
import { ClubesEntrenadoresSection } from '../features/landing/components/ClubesEntrenadoresSection'
import { GaleriaSection } from '../features/landing/components/GaleriaSection'
import { HeroSection } from '../features/landing/components/HeroSection'
import { OrganizadorCtaSection } from '../features/landing/components/OrganizadorCtaSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ClubesEntrenadoresSection />
      <GaleriaSection />
      <CalendarioNacionalSection />
      <OrganizadorCtaSection />
    </>
  )
}
