import * as bcrypt from 'bcrypt';
import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import { ObjectID } from 'mongodb';
import { getCollection } from './db/index';

const options = {};

passport.serializeUser((user, done) => {
  console.log('serializing user');
  let userId = new ObjectID(user._id);
  done(null, userId.toHexString());
});

passport.deserializeUser(async (id, done) => {
  console.log(`deserializing user: ${id}`)
  const collection = await getCollection('users');
  return collection.findOne({_id: id})
  .then((user) => {
    console.log(`deserialized user: ${user}`)
    done(null, user);
  })
  .catch((err) => { done(err,null); });
});

passport.use(new LocalStrategy(options, async (username, password, done) => {
  const collection = await getCollection('users');
  const user = await collection.findOne({ 'username': username })
  .catch((err) => { return done(err); });
  if (!user) return done(null, false);
  bcrypt.compare(password, user.passwordHash, function(err,res) {
    if(err){ console.error(err) }
    if(res) return done(null, user);
    else return done(null, false);
  })
}));