import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const localStrategy = new LocalStrategy({
  usernameField: 'email'
},
  async function (email, password, done) {
    try {
      let user = await prisma.user.findFirst({
        where: {
          email,
          password
        }
      });

      if (!user) { return done(null, false); }
      return done(null, user);

    } catch (err) {
      return done(err);
    }

  }
);

passport.use(
  localStrategy
);

// Serialization & Deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: User, done) => {
  done(null, obj);
});

export default passport;