import Axios from 'axios'
import { ICommonRequestBody } from './type/common'
import { stringify } from 'query-string'

export interface ICreateApiAxiosConfig {
    programName: string
    email: string
    id: string
    token: string
    version: string
}

export function createApiAxios({id, token, email, programName, version}: ICreateApiAxiosConfig) {
    const loginToken = `${id},${token}`
    const apiAxios = Axios.create()
    
    apiAxios.interceptors.request.use((config) => {
        const commonBody: ICommonRequestBody = {
            login_token: loginToken,
            format: 'json',
            lang: 'cn',
            error_on_empty: 'no',
        }
        const body = config.data || {}
        const bodyString = stringify({
            ...commonBody,
            ...body,
        }, {encode: false})

        return {
            ...config,
            method: 'POST',
            headers: {
                ...config.headers,
                // 请求的时候必须设置UserAgent，如果不设置或者设置为不合法的（比如设置为浏览器的）也会导致帐号被封禁API。
                'User-Agent': `${programName}/${version}(${email})`,
                'Content-Type': 'application/x-www-form-urlencoded' 
            },
            data: bodyString
        }
    })

    return apiAxios
}