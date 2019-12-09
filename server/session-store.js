/**
 * 操作 Redis 的方法封装
 */


function getRedisSessionId(sid) {
    return `ssid:${sid}`
}

class RedisSessionStore {
    constructor(client) {
        this.client = client;
    }

    /**
     * 获取 Redis 中存储的 session 数据
     * @param sid
     */
    async get(sid) {
        console.log('get session', sid);
        const id = getRedisSessionId(sid);
        // 相当于执行 Redis 的 get 命令
        const data = await this.client.get(id);
        if (!data) {
            return null;
        }
        try {
            const result = JSON.parse(data);
            return result;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * 存储 session 数据到 Redis
     * @param sid
     * @param sess => session
     * @param ttl  => 过期时间
     */
    async set(sid, sess, ttl) {
        console.log('set session', sid);
        const id = getRedisSessionId(sid);
        if (typeof ttl === 'number') {
            ttl = Math.ceil(ttl / 1000);
        }
        try {
            const sessStr = JSON.stringify(sess);
            if (ttl) {
                await this.client.setex(id, ttl, sessStr);
            } else {
                await this.client.set(id, sessStr);
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * 从 Redis 当中删除某个 session
      * @param sid
     */
    async destroy(sid) {
        console.log('destroy session', sid);
        const id = getRedisSessionId(sid);
        await this.client.del(id);
    }
}

module.exports = RedisSessionStore;
