import KoaRouter from 'koa-router';
const indexRoutes = new KoaRouter();

indexRoutes.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!'
  };
})

export { indexRoutes }