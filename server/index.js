
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const News = require('./models/News');
const Page = require('./models/Page');
const Theme = require('./models/Theme');
const SiteConfig = require('./models/SiteConfig');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ageofhamour';
const JWT_SECRET = process.env.JWT_SECRET || 'your_development_secret_key';

// Middleware
// INCREASED LIMIT for Base64 Image Uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(helmet());

// Database Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Auth Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// --- Auth Routes ---

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ 
      username, 
      email, 
      password,
      coins: 100, // Starting bonus
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`
    });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        coins: user.coins,
        status: user.status,
        avatar: user.avatar,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
      res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          coins: user.coins,
          status: user.status,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/auth/me', protect, async (req, res) => {
  if (req.user) {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      coins: req.user.coins,
      status: req.user.status,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// --- Content Routes ---

// News - Read
app.get('/api/news', async (req, res) => {
  try {
    const news = await News.find({}).sort({ date: -1 });
    res.json(news.map(n => ({ ...n._doc, id: n._id })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

// News - Create
app.post('/api/news', protect, admin, async (req, res) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json({ ...news._doc, id: news._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating news' });
  }
});

// News - Update
app.put('/api/news/:id', protect, admin, async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) return res.status(404).json({ message: 'News item not found' });
    res.json({ ...news._doc, id: news._id });
  } catch (error) {
    res.status(500).json({ message: 'Error updating news' });
  }
});

// News - Delete
app.delete('/api/news/:id', protect, admin, async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news' });
  }
});

// Site Config (Public Read)
app.get('/api/config', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create({}); // Create default if none exists
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching config' });
  }
});

// Site Config (Admin Update)
app.post('/api/config', protect, admin, async (req, res) => {
  try {
    // Delete all existing and create new (or updateOne with upsert)
    // Since it's capped/singleton, we usually update the first one
    let config = await SiteConfig.findOne();
    if (!config) {
      config = await SiteConfig.create(req.body);
    } else {
      config = await SiteConfig.findOneAndUpdate({}, req.body, { new: true });
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error updating config' });
  }
});

// Pages
app.get('/api/pages', async (req, res) => {
  try {
    const pages = await Page.find({ isHidden: false });
    res.json(pages.map(p => ({ ...p._doc, id: p._id })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pages' });
  }
});

app.post('/api/pages', protect, admin, async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json({ ...page._doc, id: page._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating page' });
  }
});

// Themes
app.get('/api/themes', async (req, res) => {
  try {
    const themes = await Theme.find({});
    res.json(themes.map(t => ({ ...t._doc, id: t._id })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching themes' });
  }
});

// Users (Admin)
app.get('/api/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users.map(u => ({
      id: u._id,
      username: u.username,
      email: u.email,
      role: u.role,
      coins: u.coins,
      status: u.status,
      avatar: u.avatar,
      createdAt: u.createdAt
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
