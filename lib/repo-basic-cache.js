// 按照时间来计算的缓存策略
import LRU from 'lru-cache'

// 使用 LRU 缓存更新策略
const GITHUB_DATA_CACHE = new LRU({
    maxAge: 1000 * 60 * 60,
});

export function cache(data, key) {
    key = key || data.full_name || data.name;
    GITHUB_DATA_CACHE.set(key, data);
}

export function getCache(key) {
    return GITHUB_DATA_CACHE.get(key);
}

export function cacheArray(dataArr) {
    if (dataArr && Array.isArray(dataArr)) {
        dataArr.forEach(item => cache(item));
    }
}
