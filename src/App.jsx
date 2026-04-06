import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Quiz from './pages/quiz/Quiz'
import CasCliniques from './pages/cas-cliniques/CasCliniques'
import Anatomie from './pages/anatomie/Anatomie'
import DashboardEnseignant from './pages/enseignant/DashboardEnseignant'
import DepotCours from './pages/enseignant/DepotCours'
import ResultatIA from './pages/enseignant/ResultatIA'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/cas-cliniques" element={<PrivateRoute><CasCliniques /></PrivateRoute>} />
          <Route path="/anatomie" element={<PrivateRoute><Anatomie /></PrivateRoute>} />
          <Route path="/enseignant" element={<PrivateRoute><DashboardEnseignant /></PrivateRoute>} />
          <Route path="/enseignant/depot" element={<PrivateRoute><DepotCours /></PrivateRoute>} />
          <Route path="/enseignant/resultat" element={<PrivateRoute><ResultatIA /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App