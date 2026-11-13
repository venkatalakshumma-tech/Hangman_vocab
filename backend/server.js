const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');

const app = express();

// NO TRAILING SLASH. e.g., 'https://hangman-vocab.vercel.app'
app.use(cors({
  origin: 'https://your-actual-vercel-url.vercel.app' 
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
