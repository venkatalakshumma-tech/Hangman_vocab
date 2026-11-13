import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const nav = useNavigate()

  return (
    <div className="landing-page">
      {/* Floating background shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      {/* Top Navigation Bar */}
      <nav className="landing-nav">
        <div className="logo">🎯 Hangman Vocab</div>
        <div className="nav-buttons">
          <button className="nav-btn-outline" onClick={() => nav('/login')}>Login</button>
          <button className="nav-btn-solid" onClick={() => nav('/register')}>Register</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">
          Expand Your Vocabulary.<br/>
          <span className="text-gradient">One Guess at a Time.</span>
        </h1>
        <p className="hero-subtitle">
          Test your knowledge with 300+ levels across Easy, Medium, and Hard difficulties. 
          Read the hint, guess the word, and don't let the stick figure hang!
        </p>
        <div className="hero-cta">
          <button className="cta-primary" onClick={() => nav('/login')}>
            Login & Play Now 🚀
          </button>
          <button className="cta-secondary" onClick={() => nav('/register')}>
            Create an Account
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>300+ Words</h3>
          <p>100 Easy, 100 Medium, and 100 Hard words to master with unique text hints.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏗️</div>
          <h3>Classic Hangman</h3>
          <p>Watch the drawing come to life with every wrong guess. You get 6 chances!</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <h3>Global Leaderboard</h3>
          <p>Earn points, avoid using hints, and climb to the top of the scoreboard.</p>
        </div>
      </section>
    </div>
  )
}
