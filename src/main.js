import Koa from 'koa';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';

import { dbConnect } from './db/index';
import { getSessionStore } from './db/sessions';
import { authRoutes } from './routes/auth';
import { indexRoutes } from './routes/index';
import { userRoutes } from './routes/user';
import './auth.js';

const PORT = process.env.PORT_NUM || 8080;

const app = new Koa();

// dbConnect().then(() => {
//   console.log('database connected');
//   app.keys = ['fh784tu03fgyerfh2gf9refiy23f9423'];
//   app.use(session({
//     store: getSessionStore()
//   }, app));
//   app.use(passport.session());
//   app.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
//   })
// }).catch((err) => {console.error(err)});
  
// app.use(bodyParser());  
// app.use(passport.initialize());

// // use the routes defined in ./routes
// app.use(indexRoutes.routes());
// app.use(authRoutes.routes());
// app.use(userRoutes.routes());

// export { app } // for tests

dbConnect().then(() => {
  console.log('database connected');
  app.keys = ['fh784tu03fgyerfh2gf9refiy23f9423'];
  app.use(session({
    store: getSessionStore()
  }, app));
  app.use(bodyParser());  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // use the routes defined in ./routes
  app.use(indexRoutes.routes());
  app.use(authRoutes.routes());
  app.use(userRoutes.routes());

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  })
}).catch((err) => {console.error(err)});
    
    
  
  