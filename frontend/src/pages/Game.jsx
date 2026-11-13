import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function HangmanDrawing({ wrongCount }) {
  return (
    <svg height="250" width="200" className="hangman-svg">
      <line x1="10" y1="240" x2="110" y2="240" stroke="#fff" strokeWidth="4" />
      <line x1="40" y1="240" x2="40" y2="20" stroke="#fff" strokeWidth="4" />
      <line x1="40" y1="20" x2="120" y2="20" stroke="#fff" strokeWidth="4" />
      <line x1="120" y1="20" x2="120" y2="50" stroke="#fff" strokeWidth="4" />
      {wrongCount >= 1 && <circle cx="120" cy="70" r="20" stroke="#ff7675" strokeWidth="4" fill="transparent" />}
      {wrongCount >= 2 && <line x1="120" y1="90" x2="120" y2="150" stroke="#ff7675" strokeWidth="4" />}
      {wrongCount >= 3 && <line x1="120" y1="110" x2="90" y2="140" stroke="#ff7675" strokeWidth="4" />}
      {wrongCount >= 4 && <line x1="120" y1="110" x2="150" y2="140" stroke="#ff7675" strokeWidth="4" />}
      {wrongCount >= 5 && <line x1="120" y1="150" x2="90" y2="190" stroke="#ff7675" strokeWidth="4" />}
      {wrongCount >= 6 && <line x1="120" y1="150" x2="150" y2="190" stroke="#ff7675" strokeWidth="4" />}
    </svg>
  )
}

export default function Game() {
  const { difficulty } = useParams()
  const nav = useNavigate()
  const [levels, setLevels] = useState([])
  const [current, setCurrent] = useState(0)
  const [guessed, setGuessed] = useState([])
  const [extraHintShown, setExtraHintShown] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [message, setMessage] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [wonLevel, setWonLevel] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/game/levels/${difficulty}`).then(r => {
      const fetchedLevels = r.data.levels;
      const completedIds = r.data.completed_ids || [];
      
      setLevels(fetchedLevels);

      // Find the first uncompleted level
      let startIndex = 0;
      for (let i = 0; i < fetchedLevels.length; i++) {
        if (!completedIds.includes(fetchedLevels[i].id)) {
          startIndex = i;
          break;
        }
      }
      
      setCurrent(startIndex);
      setLoading(false);
    })
  }, [difficulty])

  const level = levels[current]
  const word = level?.word || ''
  const maxWrong = 6
  const wrong = guessed.filter(l => !word.includes(l)).length
  const won = word.length > 0 && word.split('').every(l => guessed.includes(l))
  const lost = wrong >= maxWrong

  const submitScore = async (completed) => {
    try {
      const { data } = await API.post('/game/submit', {
        level_id: level.id,
        hints_used: hintsUsed,
        completed
      })
      if (completed) {
        setMessage(`🎉 Level ${current + 1} Completed! +${data.points} pts`)
      } else {
        setMessage(`❌ Game Over! The word was ${word}`)
      }
    } catch {
      setMessage(completed ? '✅ Level Completed!' : `❌ The word was ${word}`)
    }
  }

  const guess = (letter) => {
    if (guessed.includes(letter) || won || lost || gameOver) return
    
    const newGuessed = [...guessed, letter]
    setGuessed(newGuessed)

    const newWrong = newGuessed.filter(l => !word.includes(l)).length
    const isWon = word.split('').every(l => newGuessed.includes(l))
    const isLost = newWrong >= maxWrong

    if (isWon) {
      setGameOver(true)
      setWonLevel(true)
      submitScore(true)
    } 
    else if (isLost) {
      setGameOver(true)
      setWonLevel(false)
      submitScore(false)
    }
  }

  const useExtraHint = () => {
    if (extraHintShown) return
    setExtraHintShown(true)
    setHintsUsed(h => h + 1)
  }

  const resetLevel = () => {
    setGuessed([])
    setExtraHintShown(false)
    setHintsUsed(0)
    setMessage('')
    setGameOver(false)
    setWonLevel(false)
  }

  const nextLevel = () => {
    if (current + 1 < levels.length) {
      setCurrent(current + 1)
      resetLevel()
    } else {
      nav('/')
    }
  }

  if (loading) return <p style={{ padding: 20 }}>Loading levels...</p>;
  if (!level) return <p style={{ padding: 20 }}>All levels completed! Go back home.</p>;

  return (
    <div className="game">
      <div className="topbar">
        <button onClick={() => nav('/home')} className="back">← Back</button>
        <h2>{difficulty.toUpperCase()} — Level {current + 1}/{levels.length}</h2>
      </div>

      <div className="hint-area text-only">
        <p className="sentence">💡 {level.hint_sentence}</p>
      </div>

      <div className="hangman-container">
        <HangmanDrawing wrongCount={wrong} />
      </div>

      <div className="word">
        {word.split('').map((ch, i) => (
          <span key={i} className="letter">{guessed.includes(ch) ? ch : '_'}</span>
        ))}
      </div>

      <div className="keyboard">
        {ALPHABET.map(l => (
          <button key={l} 
            disabled={guessed.includes(l) || won || lost || gameOver}
            onClick={() => guess(l)}
            className={guessed.includes(l) ? (word.includes(l) ? 'correct' : 'wrong') : ''}>
            {l}
          </button>
        ))}
      </div>

      <div className="actions">
        <button onClick={useExtraHint} disabled={extraHintShown || won || lost || gameOver} className="hint-btn">
          🔍 Use Extra Hint (-30%)
        </button>
        {extraHintShown && <p className="extra-hint">💬 {level.extra_hint}</p>}
      </div>

      {message && (
        <div className="result">
          <p>{message}</p>
          
          {wonLevel ? (
            <button onClick={nextLevel} style={{ background: '#6c5ce7', marginTop: '15px', padding: '12px 24px', fontSize: '1.1rem' }}>
              {current + 1 < levels.length ? `Go to Level ${current + 2} →` : 'Back to Home'}
            </button>
          ) : (
            <button onClick={resetLevel} style={{ background: '#d63031', marginTop: '15px', padding: '12px 24px', fontSize: '1.1rem' }}>
              🔄 Retry Level
            </button>
          )}
        </div>
      )}
    </div>
  )
}
