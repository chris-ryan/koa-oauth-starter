import KoaRouter from 'koa-router';
import passport from 'koa-passport';
import fs from 'fs';
import { loginUser } from '../auth/controller';
import { authRequest, userStatus } from '../api/users/controller';

const authRoutes = new KoaRouter();

authRoutes.get('/auth/authorize', authRequest)

// authRoutes.post('/auth/authorize/decision', async (ctx) => {
  
// })

// /auth/login -> loginUser: Authenticates the user and redirects to /auth/authorize
authRoutes.get('/auth/login', loginUser)

authRoutes.get('/auth/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect('/auth/login');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

authRoutes.get('/auth/status', userStatus);

authRoutes.post('/auth/login', async (ctx) => {
  console.log('authenticating user login');
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      console.log(`ctx.req.user: ${ctx.req.user}`);
      console.log('redirecting to auth/status');
      ctx.redirect('/auth/status');
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});

export { authRoutes }
