
const express = require('express');
const passport = require('passport');
const { verifyToken } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  googleAuthSuccess,
  logout
} = require('../controllers/authController');

const router = express.Router();

// POST /api/auth/register - Register with email & password
router.post('/register', register);

// POST /api/auth/login - Login with email & password
router.post('/login', login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', verifyToken, getProfile);

// POST /api/auth/logout - Logout user
router.post('/logout', logout);

// GET /api/auth/google - Initiate Google Sign-In
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /api/auth/google/callback - Google OAuth2 callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}?auth=failed`,
    session: false 
  }),
  googleAuthSuccess
);

module.exports = router;
