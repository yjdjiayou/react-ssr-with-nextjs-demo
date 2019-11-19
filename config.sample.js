const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';

// 希望得到的授权
const SCOPE = 'user';

// https://github.com/settings/developers
// 在 github 上注册的 App 的 Client ID
const client_id = '2983e5e54053b2e0fdc8';
// 在 github 上注册的 App 的 Client Secret
const client_secret = 'f2d4b8bbbb3aa02cf0d79f329c6418a44736206e';

module.exports = {
  github: {
    request_token_url: 'https://github.com/login/oauth/access_token',
    client_id,
    client_secret,
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`,
};
