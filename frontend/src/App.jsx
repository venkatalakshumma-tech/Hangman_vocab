import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Game from './pages/Game'

// Route for logged-in users
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

// Route for guests (if they are logged in, send them to Home)
function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/home" /> : children
}

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      
      {/* Auth Pages */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* Protected Pages */}
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/game/:difficulty" element={<PrivateRoute><Game /></PrivateRoute>} />
    </Routes>
  )
}
