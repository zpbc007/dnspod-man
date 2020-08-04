import Axios from 'axios'
import { promiseFirstSuccess } from './utils/promiseFirstSuccess'
import { logger } from './logger'

function getIpFromUrl(url: string) {
    return Axios.get<string>(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',
            pragma: 'no-cache'
        }
    }).then((res) => {
        if (!res || !res.data) {
            logger.error(`get error response`)

            return ''
        }

        const matched = res.data.match(/\d+\.\d+\.\d+\.\d+/)

        if (!matched || matched.length === 0) {
            logger.error(`can not find ip string in response: ${res.data}`)
            return ''
        }

        const ip = matched[0]

        logger.info(`get ip: ${ip} from url: ${url}`)
        return ip
    }).catch((err) => {
        logger.error(`request ${url} filed: ${err}`)

        return Promise.reject(err)
    })
}

export function getPublicIp() {
    return promiseFirstSuccess([
        getIpFromUrl('http://ifconfig.me/ip'),
        getIpFromUrl('https://ip.cn/'),
        getIpFromUrl('http://www.net.cn/static/customercare/yourip.asp')
    ]).catch(() => '')
}