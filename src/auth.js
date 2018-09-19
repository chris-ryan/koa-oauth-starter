import * as bcrypt from 'bcrypt';
import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import { getCollection } from './db/index';

const options = {};

passport.serializeUser((user, done) => { done(null, user._id); });

passport.deserializeUser(async (id, done) => {
  const collection = await getCollection('users');
  return collection.findOne({_id: id})
  .then((user) => { done(null, user); })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, async (username, password, done) => {
  const collection = await getCollection('users');
  const user = await collection.findOne({ 'username': username })
  .catch((err) => { return done(err); });
  if (!user) return done(null, false);
  console.log(user);
  bcrypt.compare(password, user.passwordHash, function(err,res) {
    if(err){ console.error(err) }
    if(res) return done(null, user);
    else return done(null, false);
  })
}));