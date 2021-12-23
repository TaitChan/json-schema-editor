/**
 * 深拷贝
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach((keys) => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

/**
 *
 * @description 判断是否为json
 * @param str
 * @returns {boolean}
 */
export function isJson(str) {
    if (typeof str == 'string') {
        try {
            const obj = JSON.parse(str)
            return typeof obj == 'object' && obj
        } catch (e) {
            return false
        }
    } else {
        return false
    }
}
