import { fileStringReplace } from '../utils/file';

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