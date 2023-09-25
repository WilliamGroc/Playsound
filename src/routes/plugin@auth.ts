import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
import { User } from '@prisma/client';
import prisma from '~/service/prisma';
import bcrypt from 'bcrypt';

export const localStrategy = new LocalStrategy({
  usernameField: 'email'
},
  async function (email, password, done) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email
        }
      });

      if (user && await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } 

      return done('Bad user/password', false);
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

export async function hash(str: string): Promise<string> {
  return bcrypt.hash(str, 10);
}

export default passport;