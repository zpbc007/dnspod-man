import Axios from 'axios'
import { promiseFirstSuccess } from './utils/promiseFirstSuccess'

function getIpFromUrl(url: string) {
    return Axios.get<string>(url).then((res) => {
        if (!res || !res.data) {
            console.error(`get error response`)

            return ''
        }

        const matched = res.data.match(/\d+\.\d+\.\d+\.\d+/)

        if (!matched || matched.length === 0) {
            console.error(`can not find ip string in response: ${res.data}`)
            return ''
        }

        const ip = matched[0]

        console.log(`get ip: ${ip} from url: ${url}`)
        return ip
    }).catch((err) => {
        console.error(`request ${url} filed: ${err}`)

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