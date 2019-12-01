const axios = require('axios');

const github_base_url = 'https://api.github.com';

async function requestGithub(method, url, data, headers) {
  return await axios({
    method,
    url: `${github_base_url}${url}`,
    data,
    headers,
  })
}

const isServer = typeof window === 'undefined';


async function request({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('url must provide')
  }
  // 这里需要区分是客户端还是服务端
  if (isServer) {
    const session = req.session;
    const githubAuth = session.githubAuth || {};
    const headers = {};
    // 向 github 服务器发请求需要将 token 传入到 headers
    if (githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${
        githubAuth.access_token
      }`
    }
    return await requestGithub(method, url, data, headers);
  }
  else {
    // 因为客户端不直接向 github 服务器请求，而是向自己的服务器请求
    // 然后自己的服务器去请求github 服务器
    // 所以这里不需要将 token 传入到 headers
    return await axios({
      method,
      // 在客户端的请求前面统一加上 /github
      url: `/github${url}`,
      data,
    })
  }
}

module.exports = {
  request,
  requestGithub,
};
