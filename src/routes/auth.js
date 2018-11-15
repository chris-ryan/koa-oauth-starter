import KoaRouter from 'koa-router';
import fs from 'fs';
import koaConnect from 'koa-connect';
import { authRequest, loginUser, renderLogin } from '../auth/controller';
import { userStatus } from '../api/users/controller';

const authRoutes = new KoaRouter();

authRoutes.get('/auth/authorize', authRequest);

// authRoutes.post('/auth/authorize/decision', async (ctx) => {
  
// })

// /auth/login -> loginUser: Authenticates the user and redirects to /auth/authorize
authRoutes.get('/auth/login', renderLogin)

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

authRoutes.post('/auth/login', loginUser);

export { authRoutes }
