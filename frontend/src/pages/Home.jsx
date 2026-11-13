import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import API from '../api'

export default function Home() {
  const nav = useNavigate()
  const username = localStorage.getItem('username')
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch leaderboard
  const fetchLeaderboard = () => {
    setLoading(true)
    API.get('/game/leaderboard')
      .then(r => {
        setBoard(r.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  // Run fetch every time the Home page is loaded
  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    nav('/login')
  }

  return (
    <div className="home">
      <div className="topbar">
        <h1>🎯 Hangman Vocabulary</h1>
        <div>
          <span>Hi, {username}</span>
          <button onClick={logout} className="logout">Logout</button>
        </div>
      </div>

      <h2>Choose Difficulty</h2>
      <div className="difficulty-grid">
        <div className="card easy" onClick={() => nav('/game/easy')}>
          <h3>🟢 Easy</h3>
          <p>100 levels. 100 base pts.</p>
        </div>
        <div className="card medium" onClick={() => nav('/game/medium')}>
          <h3>🟡 Medium</h3>
          <p>100 levels. 150 base pts.</p>
        </div>
        <div className="card hard" onClick={() => nav('/game/hard')}>
          <h3>🔴 Hard</h3>
          <p>100 levels. 200 base pts.</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
        <h2>🏆 Leaderboard</h2>
        <button onClick={fetchLeaderboard} style={{ background: '#6c5ce7', color: '#fff', padding: '8px 16px' }}>
          🔄 Refresh
        </button>
      </div>
      
      <div className="leaderboard">
        {loading ? (
          <p>Loading scores...</p>
        ) : board.length === 0 ? (
          <p>No scores yet. Play a level to get on the board!</p>
        ) : (
          board.map((u, i) => (
            <div key={i} className="board-row">
              <span>#{i + 1} {u.username}</span>
              <strong>{u.total_score} pts</strong>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
