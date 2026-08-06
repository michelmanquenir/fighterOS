import Grid from '@mui/material/Grid'
import { CalendarioNacionalSection } from '../features/landing/components/CalendarioNacionalSection'
import { DestacadosSection } from '../features/landing/components/DestacadosSection'
import { GaleriaSection } from '../features/landing/components/GaleriaSection'
import { HeroSection } from '../features/landing/components/HeroSection'
import { JoinCtaSection } from '../features/landing/components/JoinCtaSection'
import { OrganizadorCtaSection } from '../features/landing/components/OrganizadorCtaSection'
import { ProximosEventosSection } from '../features/landing/components/ProximosEventosSection'
import { Section } from '../features/landing/components/Section'
import { StatsBar } from '../features/landing/components/StatsBar'
import { TopRankingSection } from '../features/landing/components/TopRankingSection'
import { UltimosResultadosSection } from '../features/landing/components/UltimosResultadosSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProximosEventosSection />

      <Section sx={{ pt: 0 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <UltimosResultadosSection />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TopRankingSection />
          </Grid>
        </Grid>
      </Section>

      <DestacadosSection />

      <Section sx={{ pt: 0 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <GaleriaSection />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <CalendarioNacionalSection />
          </Grid>
        </Grid>
      </Section>

      <OrganizadorCtaSection />
      <JoinCtaSection />
    </>
  )
}
