import { getPublicIp } from './getPublicIp'
import { resolve } from 'path'
import { readFile } from 'fs'
import { createApiAxios, createApi } from './api'
import { IGlobalConfig } from './type'
import { promisify } from 'util'

const asyncReadFile = promisify(readFile)

async function boot(configPath: string) {
    // 获取公网 ip
    const ip = await getPublicIp()
    if (!ip) {
        console.error(`can not get public ip`)
        return process.exit() 
    }
    console.log(`get public ip: ${ip}`)
    
    // 实例化 axios 
    const config: IGlobalConfig = JSON.parse(await asyncReadFile(configPath, {encoding: 'utf-8'}))
    console.log(`get config: ${JSON.stringify(config)}`)
    const apiAxios = createApiAxios(config)

    // 初始化 api 请求
    const {record} = createApi(apiAxios)
    
    // 获取记录列表
    const recordList = await record.getList({
        domain: config.domain
    })

    // 获取对应的子域名记录 id
    const targetRecord = recordList.records.find((record) => record.name === config.subDomain)
    if (!targetRecord) {
        console.error(`can not find the record: ${config.subDomain}`)
        return process.exit() 
    }

    // ip 没变不需要更新
    if (targetRecord.value === ip) {
        console.warn(`ip not change: ${ip}`)
        return process.exit() 
    }

    const modifyRes = await record.modify({
        domain: config.domain,
        record_id: targetRecord.id,
        sub_domain: targetRecord.name,
        record_type: targetRecord.type,
        record_line_id: targetRecord.line_id,
        value: ip
    })

    if (modifyRes && modifyRes.record && modifyRes.record.value === ip) {
        console.log(`update success new ip: ${ip}`)
    } else {
        console.log(`modify error: ${JSON.stringify(modifyRes)}`)
    }

    process.exit()
}

boot(resolve(__dirname, '../config.json'))