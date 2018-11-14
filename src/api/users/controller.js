import fs from 'fs';
import passport from 'koa-passport';
import { getSessionsByUserId } from '../../db/sessions';
import User from './model';

export async function getUserSessions (ctx) {
  // check the user exists and is active
  const user = await User.findByUsername(ctx.params.username);
  if (user && user.active) {
    // find the sessions with the user's id
    const userSerialId = User.serializeUser(user);
    const userSessions = await getSessionsByUserId(userSerialId);
    console.log(userSessions.length);
    ctx.body = user;
  }
}

// export async function registerUser (ctx) {
//   const user = new User(ctx.request.body);
//   // error if the username is already registered
//   let result = await user.exists();
//   if (result) ctx.throw(400, 'user with that username already exists');
//   else {
//     user.passwordHash = User.hashPassword(ctx.request.body.password);
//     let userId = await user.save();
//     // call login from koa-passport to trigger creation of the session
//     return passport.authenticate('local', (err, user, info, status) => {
//       if (user) {
//         console.log('calling ctx.login');
//         ctx.login(user);
//         // ctx.body = { id: userId};
//         console.log('redirecting to /auth/status');
//         ctx.redirect('/auth/status');
//       } else {
//         ctx.status = 400;
//         ctx.body = { status: 'error' };
//       }
//     })
//   }
// }

export async function userStatus (ctx) {
  console.log(`ctx.req.user: ${ctx.req.user}`);
  console.log(`isAuthenticated: ${ctx.isAuthenticated()}`);
  if (ctx.isAuthenticated()) {
  ctx.type = 'html';
   ctx.body = fs.createReadStream('./src/views/status.html');
  } else {
    ctx.redirect('/auth/login');
  }
}