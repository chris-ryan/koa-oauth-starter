import Koa from 'koa';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';

import { authRoutes } from './routes/auth';
import { indexRoutes } from './routes/index';
const app = new Koa();
const PORT = process.env.PORT_NUM || 8080;

app.keys = ['fh784tu03fgyerfh2gf9refiy23f9423'];
app.use(session(app));
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

// use the routes defined in ./routes
app.use(indexRoutes.routes());
app.use(authRoutes.routes());

export { app } // for tests

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})


