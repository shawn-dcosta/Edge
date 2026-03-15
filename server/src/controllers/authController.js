import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';

export const register = async (req, res) => {
  const { name, email, password, companyName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      displayName: name,
      email,
      password: hashedPassword,
      companyName,
      isAdmin: false
    });

    req.login(newUser, (err) => {
      if (err) return res.status(500).json({ message: "Login failed after registration" });
      res.status(201).json(newUser);
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message || "Login failed" });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json(user);
    });
  })(req, res, next);
};
