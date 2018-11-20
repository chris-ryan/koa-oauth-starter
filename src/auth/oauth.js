import * as oauth2orize from 'oauth2orize-koa';
import passport from 'koa-passport';
import KoaRouter from 'koa-router';
import uid from 'uid2';
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
  async findOne(code) {
    console.log('retreiving auth code from database');
    const collection = await getCollection('auth.codes').catch(err => console.error(err));
    let result = await collection.findOne({'code': code}).catch(err => console.error(err));
    return result;
  }
  async save () {
    console.log('writing auth code to database');
    const collection = await getCollection('auth.codes').catch(err => console.error(err));
    let result = await collection.insertOne(this).catch(err => console.error(err));
    return result;
  }
}

const oAuthRoutes = new KoaRouter();

const authServer = oauth2orize.createServer();

// Register the functions required by oauth2orize
authServer.grant(oauth2orize.grant.code(async function (client, redirectURI, user, decision, ares) {
  console.log(`client: ${client.name}
  redirectURI: ${redirectURI}
  user: ${user.username}
  decision: ${Object.keys(decision)}: ${Object.values(decision)}`);
  console.log(`ares: ${Object.keys(ares)}`);
  const code = uid(16);
  console.log('generating new Authorization code');
  var ac = new AuthorizationCode(code, client.id, redirectURI, user.username, ares.scope);
  await ac.save();
  return code;
}))

authServer.exchange(oauth2orize.exchange.code(async function(client, code, redirectURI){
  console.log('retrieving code from db');
  code = await AuthorizationCode.findOne(code);
  const token = uid(256);
  //save token to db
  return token;
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

// oauth2orize API endpoints
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
  }
);

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

oAuthRoutes.post('/auth/decision', ...authServer.decision());
// oAuthRoutes.post('/auth/decision', (ctx) => {
//   const decisionHandler = authServer.decision()
//   console.log(`function 1: ${decisionHandler[0]}
//   function 2: ${decisionHandler[1]}`);
// });

export { oAuthRoutes }
