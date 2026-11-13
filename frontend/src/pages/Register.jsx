import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    setLoading(true)
    setError('')

    try {
      const { data } = await API.post('/auth/register', { username, email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      nav('/home')
    } catch (err) {
      setError(err.response?.data?.message || err.message ||'Registration failed. Please try again.')
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
          <div className="auth-icon">📝</div>
          <h2>Create Account</h2>
          <p>Join to start playing and climbing the leaderboard</p>
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
            <span className="input-icon">📧</span>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
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

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register ✨'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
