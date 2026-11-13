import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { data } = await API.post('/auth/login', { username, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      nav('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-container animated-bg">
      {/* Floating background shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      <div className="auth-box glass-effect">
        <div className="auth-header">
          <div className="auth-icon">🎯</div>
          <h2>Welcome Back</h2>
          <p>Login to continue your Hangman streak</p>
        </div>

        {error && <div className="error-badge">{error}</div>}

        <form onSubmit={submit}>
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login 🚀'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
