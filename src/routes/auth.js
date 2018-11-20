import KoaRouter from 'koa-router';
import { loginUser, renderLogin } from '../auth/oauth';
import { userStatus } from '../api/users/controller';

const authRoutes = new KoaRouter();

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
