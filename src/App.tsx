import { Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { BoxeadorPerfilPage } from './pages/BoxeadorPerfilPage'
import { BoxeadoresListPage } from './pages/BoxeadoresListPage'
import { CrearEventoPage } from './pages/CrearEventoPage'
import { CrearGimnasioPage } from './pages/CrearGimnasioPage'
import { EventoDetallePage } from './pages/EventoDetallePage'
import { EventosListPage } from './pages/EventosListPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { MisEventosPage } from './pages/MisEventosPage'
import { RegistroEspectadorPage } from './pages/RegistroEspectadorPage'
import { RegistroBoxeadorPage } from './pages/RegistroBoxeadorPage'
import { RegistroGimnasioPage } from './pages/RegistroGimnasioPage'
import { RegistroPage } from './pages/RegistroPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/eventos" element={<EventosListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route path="/registro/espectador" element={<RegistroEspectadorPage />} />
        <Route path="/registro/boxeador" element={<RegistroBoxeadorPage />} />
        <Route path="/registro/gimnasio" element={<RegistroGimnasioPage />} />
        <Route path="/boxeadores" element={<BoxeadoresListPage />} />
        <Route path="/boxeadores/:id" element={<BoxeadorPerfilPage />} />
        <Route path="/eventos/mios" element={<MisEventosPage />} />
        <Route path="/gimnasios/crear" element={<CrearGimnasioPage />} />
        <Route path="/eventos/crear" element={<CrearEventoPage />} />
        <Route path="/eventos/:id" element={<EventoDetallePage />} />
      </Route>
    </Routes>
  )
}

export default App
