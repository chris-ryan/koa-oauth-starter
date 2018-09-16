import Koa from 'koa';

const app = new Koa();
const PORT = 8080;

app.use(async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!'
  };
});

export { app }

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})


