import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }

      // If no googleId, check for existing email
      const email = profile.emails[0].value;
      user = await User.findOne({ email });

      if (user) {
        // Link Google ID to existing email account
        user.googleId = profile.id;
        if (!user.avatar) user.avatar = profile.photos[0].value;
        await user.save();
        return done(null, user);
      } else {
        // Create new user if neither googleId nor email exists
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          email: email,
          avatar: profile.photos[0].value,
          isAdmin: false
        });
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Incorrect email.' });
      
      if (!user.password) {
        return done(null, false, { message: 'This account uses Google Login.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
