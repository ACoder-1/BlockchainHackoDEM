// Backend - server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/energy-marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Energy Offer Schema
const energyOfferSchema = new mongoose.Schema({
  producer: {
    type: String,
    required: true
  },
  priceInWei: {
    type: String,
    required: true
  },
  energyAmount: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true,
    default: 24
  },
  expiresAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'sold'],
    default: 'active'
  },
  transactions: [{
    buyer: String,
    amount: Number,
    timestamp: Date
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  offerId: {
    type: Number,
    required: true,
    unique: true
  }
});

const EnergyOffer = mongoose.model('EnergyOffer', energyOfferSchema);
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['producer', 'consumer'], required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const User = mongoose.model('User', userSchema);
// Routes
app.get('/api/energy-offers', async (req, res) => {
  try {
    const offers = await EnergyOffer.find({ 
      status: 'active',
      expiresAt: { $gt: new Date() }
    }).sort({ timestamp: -1 });
    
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers', error: error.message });
  }
});

app.post('/api/list-energy', async (req, res) => {
  try {
    const { price, energyAmount, duration, producer } = req.body;

    if (!price || !energyAmount || !producer) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const lastOffer = await EnergyOffer.findOne().sort({ offerId: -1 });
    const nextOfferId = lastOffer ? lastOffer.offerId + 1 : 1;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + (duration || 24));

    const newOffer = new EnergyOffer({
      producer,
      priceInWei: price,
      energyAmount,
      duration: duration || 24,
      expiresAt,
      offerId: nextOfferId
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating offer', error: error.message });
  }
});
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});
app.get('/api/leaderboard', async (req, res) => {
    const leaderboard = await EnergyOffer.aggregate([
      { $group: { _id: '$producer', totalEnergySold: { $sum: '$energyAmount' } } },
      { $sort: { totalEnergySold: -1 } }
    ]);
    res.json(leaderboard);
  });
  
// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});
app.post('/api/purchase-energy', async (req, res) => {
  try {
    const { offerId, amount, buyer } = req.body;

    const offer = await EnergyOffer.findOne({ 
      offerId,
      status: 'active',
      expiresAt: { $gt: new Date() }
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found or expired' });
    }

    if (offer.energyAmount < amount) {
      return res.status(400).json({ message: 'Insufficient energy amount available' });
    }

    // Update offer
    offer.energyAmount -= amount;
    offer.transactions.push({
      buyer,
      amount,
      timestamp: new Date()
    });

    if (offer.energyAmount === 0) {
      offer.status = 'sold';
    }

    await offer.save();
    res.json({ message: 'Purchase successful', offer });
  } catch (error) {
    res.status(500).json({ message: 'Purchase failed', error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});