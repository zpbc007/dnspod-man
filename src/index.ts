import { getPublicIp } from './getPublicIp'
import { resolve } from 'path'
import { readFile } from 'fs'
import { createApiAxios, createApi } from './api'
import { IGlobalConfig } from './type'
import { promisify } from 'util'
import { ILogConfig, create, logger } from './logger'

const asyncReadFile = promisify(readFile)

/** 加载配置 */
async function loadConfig() {
    const dnsConfigPath = resolve(__dirname, '../config.json')
    const loggerConfigPath = resolve(__dirname, '../logConfig.json')

    return Promise.all([
        asyncReadFile(dnsConfigPath, {encoding: 'utf-8'}),
        asyncReadFile(loggerConfigPath, {encoding: 'utf-8'}),
    ]).then(([dnsConfigStr, loggerConfigStr]) => [
        JSON.parse(dnsConfigStr),
        JSON.parse(loggerConfigStr)
    ] as [IGlobalConfig, ILogConfig])
}

async function boot() {
    const [
        dnsConfig,
        loggerConfig
    ] = await loadConfig()

    create(loggerConfig)
    logger.info('logger created by config: %o', loggerConfig)

    // 获取公网 ip
    const ip = await getPublicIp()
    if (!ip) {
        logger.error(`can not get public ip`)
        return process.exit() 
    }
    logger.info(`get public ip: ${ip}`)

    // 实例化 axios 
    const apiAxios = createApiAxios(dnsConfig)
    logger.info('api axios created by config: %o', dnsConfig)

    // 初始化 api 请求
    const {record} = createApi(apiAxios)

    // 获取记录列表
    const recordList = await record.getList({
        domain: dnsConfig.domain
    })

    // 获取对应的子域名记录 id
    const targetRecord = recordList.records.find((record) => record.name === dnsConfig.subDomain)
    if (!targetRecord) {
        logger.error(`can not find the record: ${dnsConfig.subDomain}`)
        return process.exit() 
    }

    // ip 没变不需要更新
    if (targetRecord.value === ip) {
        logger.warn(`ip not change: ${ip}`)
        return process.exit() 
    }

    const modifyRes = await record.modify({
        domain: dnsConfig.domain,
        record_id: targetRecord.id,
        sub_domain: targetRecord.name,
        record_type: targetRecord.type,
        record_line_id: targetRecord.line_id,
        value: ip
    })

    if (modifyRes && modifyRes.record && modifyRes.record.value === ip) {
        logger.log(`update success new ip: ${ip}`)
    } else {
        logger.error(`modify error: ${JSON.stringify(modifyRes)}`)
    }

    process.exit()
}

boot()