import express from 'express';
import passport from 'passport';
import { register, login } from '../controllers/authController.js';
const router = express.Router();

// Local Auth
router.post('/register', register);
router.post('/login', login);

// Auth with Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to admin.
    res.redirect('http://localhost:5173/admin');
  }
);

// Get current user info
router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

export default router;
