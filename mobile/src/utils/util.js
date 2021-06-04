/**
 * 对时间秒格式化，将 128 -> 2:08
 * @param interval
 * @returns {string}
 */
 export function formatTime (interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = pad(interval % 60)
    return `${minute}:${second}`
}