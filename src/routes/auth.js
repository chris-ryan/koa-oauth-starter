import KoaRouter from 'koa-router';
import passport from 'koa-passport';
import fs from 'fs';
import { userStatus } from '../api/users/controller';

const authRoutes = new KoaRouter();

authRoutes.get('/auth/login', async (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/views/login.html');
  } else {
    ctx.redirect('/auth/status');
  }
})

authRoutes.post('/auth/login', async (ctx) => {
  console.log('authenticating user login');
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      ctx.redirect('/auth/status');
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error' };
    }
  })(ctx);
});

authRoutes.get('/auth/status', userStatus);

export { authRoutes }