/**
 * 获取首先 resolve 的 promise 的返回值
 * @param promises 
 */
export function promiseFirstSuccess<T>(promises: Array<Promise<T>>) {
    return Promise.all(promises.map(pro => {
        return pro.then(
            res => Promise.reject(res), 
            err => Promise.resolve(err)
        )
    })).then(
        errors => Promise.reject(errors),
        res => Promise.resolve(res)
    )
}