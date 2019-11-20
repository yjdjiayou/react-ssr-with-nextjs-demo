const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const session = require('koa-session');
const Redis = require('ioredis');
const koaBody = require('koa-body');
const atob = require('atob');

const auth = require('./server/auth');
const api = require('./server/api');

const RedisSessionStore = require('./server/session-store');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

// 创建 Redis client
// 如果通过这里连接 Redis 时，就不需要再通过命令行连接 Redis
const redis = new Redis({
    port: 6379,
    password: 123456
});

// 因为 Node.js 没有 window 对象，所以无法使用 atob
// 这里通过插件给 Nodejs 全局增加一个 atob 方法
global.atob = atob;

app.prepare().then(() => {
    const server = new Koa();
    const router = new Router();

    server.keys = ['develop Github App'];

    server.use(koaBody());

    const SESSION_CONFIG = {
        key: 'qwer',
        // 将 Koa 的 session 存储到 Redis 中
        store: new RedisSessionStore(redis),
    };

    server.use(session(SESSION_CONFIG, server));

    // 配置处理 Github OAuth 登录 的中间件
    // 必须放在上面的 session 中间件后面
    auth(server);
    api(server);

    server.use(router.routes());

    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session;
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
    });

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });

    server.listen(3000, () => {
        console.log('koa server listening on 3000');
    });

});
