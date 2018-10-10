import KoaRouter from 'koa-router';
import passport from 'koa-passport';
import fs from 'fs';
import { userStatus } from '../api/users/controller';

const authRoutes = new KoaRouter();

authRoutes.get('/auth/authorize', async (ctx) => {
  console.log(ctx.query);
  // check for required query parameters
  if (ctx.query.response_type && ctx.query.client_id && ctx.query.redirect_uri) {
    console.log('all good')
  } else {
    ctx.throw(400);
  }
  // if (!ctx.isAuthenticated()) {
  //   ctx.type = 'html';
  //   ctx.body = fs.createReadStream('./src/views/login.html');
  // } else {
  //   ctx.redirect('/auth/status');
  // }
})

// authRoutes.post('/auth/authorize/decision', async (ctx) => {
  
// })

authRoutes.get('/auth/login', async (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/views/login.html');
  } else {
    ctx.redirect('/auth/status');
  }
})

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
