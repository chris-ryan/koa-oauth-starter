import * as oauth2orize from 'oauth2orize-koa';
import passport from 'koa-passport';
import KoaRouter from 'koa-router';
import uid from 'uid2';
import * as url from 'url';
import { getCollection } from '../db/index';
import { fileStringReplace } from '../utils/file';

class AuthorizationCode {
  constructor(code, clientId, redirectURI, userId, scope) {
    this.code = code;
    this.userId = userId;
    this.clientId = clientId;
    this.scope = scope;
    this.createdAt = new Date();
  }
  async save () {
    const collection = await getCollection('auth.codes').catch(err => console.error(err));
    let result = await collection.insertOne(this).catch(err => done(err));
    return result;
  }
}

const oAuthRoutes = new KoaRouter();

const authServer = oauth2orize.createServer();

// Register the functions required by oauth2orize
authServer.grant(oauth2orize.grant.code(async (client, redirectURI, user, ares) => {
  const code = uid(16);
  console.log('generating new Authorization code');
  var ac = new AuthorizationCode(code, client.id, redirectURI, user.id, ares.scope);
  console.log('ac.save(): ' + ac.save());
  await ac.save();
  console.log(`code: ${code}`);
  return code;
  // ac.save(function(err) {
  //   if (err) { return done(err); }
  //   return done(null, code);
  // });
}))

authServer.serializeClient((client) => {
  console.log('serializing client');
  return client.id;
});

authServer.deserializeClient(async (id) => {
  console.log('deserializing client');
  const collection = await getCollection('auth.clients').catch(err => console.error(err));
  let client = await collection.findOne({'id': id}).catch(err => console.error(err));
  if (!client) { return false; }
  return client;
});

// authRequest is written as express-style middleware for oauth2orize compatibility
// export async function authRequest (req, res, next) {
//   // parse the url to populate req.query
//   const url_parts = url.parse(req.url, true);
//   req.query = url_parts.query;
//   // check for required query parameters
//   if (req.query.response_type && req.query.client_id && req.query.redirect_uri) {
//     // check the user is authenticated
//     //if (!ctx.isAuthenticated()) ctx.redirect('/auth/login');
//     console.log('calling authorize');
//     return authServer.authorize(async (clientID, redirectURI, done) => {
//     console.log('looking for the client');
//       // find the client db record
//       const collection = await getCollection('auth.clients').catch(err => console.error(err));
//       let client = await collection.findOne({'id': clientID}).catch(err => done(err));
//       if (!client) { return done(null, false); }
//       else if (client.redirectUri != redirectURI) { return done(null, false); }
//       else done(null, client, client.redirectURI);
//       console.log(client);
//     })(req, res, next);
//   } else {
//     throw new Error('Missing parameters');
//   }
// }
// koa-style oauth2orize client authorization request endpoint
oAuthRoutes.get('/auth/authorize',
  authServer.authorize(async function (clientID, redirectURI) {
      console.log('looking for the client');
      // find the client db record
      const collection = await getCollection('auth.clients').catch(err => console.error(err));
      let client = await collection.findOne({'id': clientID}).catch(err => console.error(err));
      if (!client) { return false; }
      else if (client.redirectUri != redirectURI) { return false; }
      else {
        console.log(`client found in database: ${Object.values(client)}`);
        return [client, client.redirectUri];
      }
  }),
  async function(ctx) {
    ctx.type = 'html';
    const replaceSet = [
      ['USERNAME', `${ctx.state.user.username}`],
      ['APPNAME', `${ctx.state.oauth2.client.name}`],
      ['TRANSACTIONID', `${ctx.state.oauth2.transactionID}`]
    ];
    ctx.body = await fileStringReplace('./src/views/authorize.html', replaceSet)
    // `<html><body><h3>${ctx.state.user.username},
    //     do you authorise the CREDIS web app to access your account?</h3>
    //   <p>Transaction ID: ${ctx.state.oauth2.transactionID}</p>
    //   <p>Client: ${ctx.state.oauth2.client}</p>
    //   </body></html>`;
  }
);

// oAuthRoutes.post('/auth/decision', authServer.decision());

export async function loginUser (ctx) {
  console.log(`authenticating user: ${ctx.req.user}`);
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user);
      console.log('redirecting to auth/authorize');
      ctx.redirect(`/auth/authorize?response_type=${ctx.query.response_type}&client_id=${ctx.query.client_id}&redirect_uri=${ctx.query.redirect_uri}`);
    } else {
      ctx.status = 400;
      ctx.body = { status: 'error' };
    }
  })(ctx);
}

export async function renderLogin (ctx) {
  // check for required query parameters
  if (ctx.query.response_type && ctx.query.client_id && ctx.query.redirect_uri) {
    const queryString = `response_type=${ctx.query.response_type}&client_id=${ctx.query.client_id}&redirect_uri=${ctx.query.redirect_uri}`;
    if (!ctx.isAuthenticated()) {
      console.log(ctx.query);
      ctx.type = 'html';
      const replaceSet = [['FORMACTION', `/auth/login?${queryString}`]];
      ctx.body = await fileStringReplace('./src/views/login.html', replaceSet)
    } else {
      ctx.redirect(`/auth/authorize?${queryString}`);
    }
  } else {
    ctx.throw(400);
  }
}

export { oAuthRoutes }
