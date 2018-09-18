import KoaRouter from 'koa-router';
import passport from 'koa-passport';
import fs from 'fs';

const authRoutes = new KoaRouter();

authRoutes.get('/auth/login', async (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/views/login.html');
  } else {
    ctx.redirect('/auth/status');
  }
})

export { authRoutes }