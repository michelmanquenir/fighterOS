import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { BoxeadorPerfilPage } from './pages/BoxeadorPerfilPage'
import { BoxeadoresListPage } from './pages/BoxeadoresListPage'
import { LoginPage } from './pages/LoginPage'
import { RegistroBoxeadorPage } from './pages/RegistroBoxeadorPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/boxeadores" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroBoxeadorPage />} />
        <Route path="/boxeadores" element={<BoxeadoresListPage />} />
        <Route path="/boxeadores/:id" element={<BoxeadorPerfilPage />} />
      </Route>
    </Routes>
  )
}

export default App
