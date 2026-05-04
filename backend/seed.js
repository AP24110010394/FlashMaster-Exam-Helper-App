const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flashmaster');
    console.log('MongoDB connected for seeding...');

    // Clear existing users from seed for idempotency
    await User.deleteMany({ email: { $in: ['admin@flashmaster.com', 'user@flashmaster.com'] } });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const admin = new User({
      username: 'admin',
      email: 'admin@flashmaster.com',
      password: password,
      role: 'admin'
    });

    const user = new User({
      username: 'user',
      email: 'user@flashmaster.com',
      password: password,
      role: 'user'
    });

    await admin.save();
    await user.save();

    console.log('Database seeded successfully completely!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
