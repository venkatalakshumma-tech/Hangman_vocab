import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    
    // Check if passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      const { data } = await API.post('/auth/register', { username, email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      nav('/')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Register failed')
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="auth-box">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        
        <button type="submit">Register</button>
        <p>Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}
