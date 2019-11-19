const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const SCOPE = 'user';

const client_id = 'ed0029308c5855c19c57';

module.exports = {
  github: {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id,
    client_secret: '2c0f72d4d1c1ee4b28f00f8bd3c4bb48f32c920f',
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`,
};

// token 8de99c7accd48c7476c264e6a1971b38f26183fc
