module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/flashmaster',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  BCRYPT_ROUNDS: 10,
  MAX_DECKS_PER_USER: 50,
  MAX_CARDS_PER_DECK: 1000,
};
