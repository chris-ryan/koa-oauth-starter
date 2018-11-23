import * as bcrypt from 'bcryptjs';
import passport from 'koa-passport';
import { BasicStrategy } from 'passport-http';
import ClientPasswordStrategy from 'passport-oauth2-client-password';
import LocalStrategy from 'passport-local';
import { ObjectID } from 'mongodb';
import { getCollection } from './db/index';
import User from './api/users/model';

const options = {};

passport.serializeUser((user, done) => {
  console.log('serializing user');
  let userId = new ObjectID(user._id);
  done(null, userId.toHexString());
});

passport.deserializeUser(async (id, done) => {
  console.log(`deserializing user: ${id}`)
  const user = await User.findById(id);
  if (user) {
    console.log(`deserialized user found: ${user}`)
    done(null, user);
  } else {
    done(new Error('user not found'),null);
  }
});

passport.use(new LocalStrategy(options, async (username, password, done) => {
  const collection = await getCollection('users');
  const user = await collection.findOne({ 'username': username })
  .catch((err) => { return done(err); });
  if (!user) return done(null, false);
  if (!user.id) user.id = user._id; // delete this?
  console.log(`username: ${user.username}`);
  bcrypt.compare(password, user.password, function(err,res) {
    if(err){ console.error(err) }
    if(res) {
      console.log(`returning user: ${Object.keys(user)}`);
      return done(null, user); 
    }
    else return done(null, false);
  })
}));

// Basic stratgey for Client app authentication
passport.use(new BasicStrategy(options, async (clientId, secret, done) => {
  console.log('passport basic strategy');
  const collection = await getCollection('auth.clients');
  const client = await collection.findOne({ 'id': clientId })
  .catch((err) => { return done(err); });
  if (!client || client.secret !== secret) return done(null, false);
  return done(null, client);
}));

// Client password strategy for token exchange endpoint
passport.use(new ClientPasswordStrategy(async (clientId, secret, done) => {
  console.log('passport client password strategy');
  const collection = await getCollection('auth.clients');
  const client = await collection.findOne({ 'id': clientId })
  .catch((err) => { return done(err); });
  if (!client || client.secret !== secret) return done(null, false);
  return done(null, client);
}));