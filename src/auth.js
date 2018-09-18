import * as bcrypt from 'bcrypt';
import passport from 'koa-passport';
import { LocalStrategy } from 'passport-local';
import { GetInstance } from './db/index';

const db = GetInstance();
const collection = db.collection('users');

const options = {};

passport.serializeUser((user, done) => { done(null, user.id); });

passport.deserializeUser((id, done) => {
  return knex('users').where({id}).first()
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, async (username, password, done) => {
  const user = await collection.findOne({ 'username': username })
  .catch((err) => { return done(err); });
  if (!user) return done(null, false);
  if (bcrypt.compare(password, user.passwordHash)) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));