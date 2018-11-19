import KoaRouter from 'koa-router';
import fs from 'fs';
import koaConnect from 'koa-connect';
import { loginUser, renderLogin } from '../auth/oauth';
import { userStatus } from '../api/users/controller';

const authRoutes = new KoaRouter();

// authRoutes.get('/auth/authorize', authRequest, function(ctx) {
//   ctx.type = 'html';
//   ctx.body = `<html><body><h2>Do you authorise the CREDIS web app to access your account?</h2>
//     <p>Transaction ID: ${ctx.state.oauth2.transactionID}</p>
//     <p>User: ${ctx.state.user}</p>
//     <p>Client: ${ctx.state.oauth2.client}</p>
//   </body></html>`;
// });

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
