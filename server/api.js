const { requestGithub } = require('../lib/api');

module.exports = server => {
  server.use(async (ctx, next) => {
    const path = ctx.path;
    const method = ctx.method;

    if (path.startsWith('/github/')) {
      console.log(ctx.request.body);
      const session = ctx.session;
      const githubAuth = session && session.githubAuth;
      const headers = {};
      if (githubAuth && githubAuth.access_token) {
        headers['Authorization'] = `${githubAuth.token_type} ${
          githubAuth.access_token
        }`
      }
      // 向 github 服务器发起请求
      const result = await requestGithub(
        method,
        ctx.url.replace('/github/', '/'),
        ctx.request.body || {},
        headers,
      );

      ctx.status = result.status;
      ctx.body = result.data
    } else {
      await next()
    }
  })
};
