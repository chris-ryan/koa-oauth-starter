import * as oauth2orize from 'oauth2orize';
import { getCollection } from '../../db/index';
import { fileStringReplace } from '../utils/file';

const authServer = oauth2orize.createServer();

export async function authRequest (ctx) {
  console.log(ctx.query);
  // check for required query parameters
  if (ctx.query.response_type && ctx.query.client_id && ctx.query.redirect_uri) {
    // check the user is authenticated
    if (!ctx.isAuthenticated()) ctx.redirect('/auth/login');
    server.authorize(async function(clientID, redirectURI, done) {
      // find the client db record
      const collection = await getCollection('auth.clients').catch(err => console.error(err));
      let client = await collection.findOne({'id': clientID}).catch(err => done(err));
      if (!client) { return done(null, false); }
      else if (client.redirectUri != redirectURI) { return done(null, false); }
      else done(null, client, client.redirectURI);
      console.log(client);
    })
  } else {
    ctx.throw(400);
  }
}

export async function loginUser (ctx) {
  // check for required query parameters
  if (ctx.query.response_type && ctx.query.client_id && ctx.query.redirect_uri) {
    const queryString = `response_type=${ctx.query.response_type}&client_id=${ctx.query.client_id}&redirect_uri=${ctx.query.redirect_uri}`;
    if (!ctx.isAuthenticated()) {
      console.log(ctx.query);
      ctx.type = 'html';
      // ctx.body = fs.createReadStream('./src/views/login.html');
      ctx.body = await fileStringReplace('./src/views/login.html', 'FORMACTION', `/auth/login?${queryString}`)
    } else {
      ctx.redirect(`/auth/authorize?${queryString}`);
    }
  } else {
    ctx.throw(400);
  }
}