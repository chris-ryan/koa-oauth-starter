import KoaRouter from 'koa-router';
import passport from 'koa-passport';
import User from '../api/users/model';
// import { registerUser } from '../api/users/controller';

const userRoutes = new KoaRouter();

// userRoutes.post('/user/register', registerUser);

userRoutes.post('/user/register', async (ctx) => {
  const user = new User(ctx.request.body);
  // error if the username is already registered
  let result = await user.exists();
  if (result) ctx.throw(400, 'user with that username already exists');
  else {
    user.passwordHash = User.hashPassword(ctx.request.body.password);
    let userId = await user.save();
    // call login from koa-passport to trigger creation of the session
    console.log(`user: ${Object.keys(user)}`);
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        // ctx.body = { id: userId};
        console.log('redirecting to /auth/status');
        ctx.redirect('/auth/status');
      } else {
        ctx.status = 400;
        ctx.body = { status: 'error' };
      }
    })(ctx);
  }
})

export { userRoutes }