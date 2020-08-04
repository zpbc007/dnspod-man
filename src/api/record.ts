import { AxiosInstance } from "axios"
import { ICommonResponse } from "./type/common"

export interface IGetListConfig {
    // 域名ID
    domain_id?: string
    // 域名
    domain?: string
    // 记录开始的偏移，第一条记录为 0，依次类推，可选（仅当指定 length 参数时才生效）
    offset?: number
    // 共要获取的记录数量的最大值，比如最多获取20条，则为20，最大3000.可选
    length?: number 
    // 子域名，如果指定则只返回此子域名的记录，可选
    sub_domain?: string 
    // 记录类型，通过API记录类型获得，大写英文，比如：A，可选
    record_type?: string 
    // 记录线路，通过API记录线路获得，中文，比如：默认，可选
    record_line?: string 
    // 线路的ID，通过API记录线路获得，英文字符串，比如：‘10=1’，可选 【需要获取特定线路的解析记录时，record_line 和 record_line_id 二者传其一即可，系统优先取 record_line_id】
    record_line_id?: string 
    // 搜索的关键字，如果指定则只返回符合该关键字的记录，可选 【指定 keyword 后系统忽略查询参数 sub_domain，record_type，record_line，record_line_id】
    keyword?: string
}

export interface IRecord {
    // 记录ID编号
    id: string
    // 子域名(主机记录)
    name: string
    // 解析记录的线路, 详见 Record.Line 接口
    line: string
    // 解析记录的线路ID，详见 Record.Line 接口
    line_id: string
    // 记录类型, 详见 Record.Type 接口
    type: string
    // 记录的 TTL 值
    ttl: string
    // 记录值
    value: string
    // 记录的 MX 记录值, 非 MX 记录类型，默认为 0
    mx: string
    // 记录状态 "0": 禁用 "1": 启用
    enabled: '0' | '1'
    // 系统内部标识状态, 开发者可忽略
    status: string
    // 该记录的D监控状态 
    // "Ok": 服务器正常 
    // "Warn": 该记录有报警, 服务器返回 4XX 
    // "Down": 服务器宕机
    // "": 该记录未开启D监控
    monitor_status: 'Ok' | 'Warn' | 'Down' | ''
    // 记录备注
    remark: string
    // 记录最后更新时间
    updated_on: string
    // 是否开通网站安全中心 "yes": 已经开启 "no": 未开启
    use_aqb: 'yes' | 'no'
}

export interface IListResponse extends ICommonResponse {
    domain: {
        // 域名ID，即为 domain_id
        id: string
        // 域名
        name: string
        // punycode 转码之后的域名
        punycode: string
        // 域名等级，详见 Domain.List 或 Domain.Info 接口
        grade: string
        // 域名所有者
        owner: string
        // 域名等级对应的ns服务器地址
        dnspod_ns: string[]
    }
    info: {
        // 指定域名下所有记录的总数
        sub_domains: string
        // 指定域名下符合查询条件的记录总数
        record_total: string
        // 返回的 records 列表里的记录数目
        records_num: string
    }
    records: IRecord[]
}

export interface IModifyConfig {
    // 域名ID
    domain_id?: string
    // 域名
    domain?: string
    // 记录ID，必选
    record_id: string
    // 主机记录, 如 www，可选，如果不传，默认为 @
    sub_domain?: string
    // 记录类型，通过API记录类型获得，大写英文，比如：A，必选
    record_type: string
    // 记录线路，通过API记录线路获得，中文，比如：默认，必选
    record_line?: string
    // 线路的ID，通过API记录线路获得，英文字符串，比如：‘10=1’ 【record_line 和 record_line_id 二者传其一即可，系统优先取 record_line_id】
    record_line_id?: string
    // 记录值, 如 IP:200.200.200.200, CNAME: cname.dnspod.com., MX: mail.dnspod.com.，必选
    value: string
    // {1-20} MX优先级, 当记录类型是 MX 时有效，范围1-20, mx记录必选
    mx?: number
    // {1-604800} TTL，范围1-604800，不同等级域名最小值不同，可选
    ttl?: number
    // [“enable”, “disable”]，记录状态，默认为”enable”，如果传入”disable”，解析不会生效，也不会验证负载均衡的限制，可选
    status?: 'enable' | 'disable'
    // 权重信息，0到100的整数，可选。仅企业 VIP 域名可用，0 表示关闭，留空或者不传该参数，表示不设置权重信息
    weight?: number
}

export interface IModifyResponse extends ICommonResponse {
    record: {
        // 记录ID, 即为 record_id
        id: string
        // 子域名
        name: string
        // 记录值
        value: string 
        // 记录状态
        status: string 
    }
}

export function createRecordListRequest(axios: AxiosInstance) {
    const listUrl = 'https://dnsapi.cn/Record.List'
    const modifyUrl = 'https://dnsapi.cn/Record.Modify'
    return {
        async getList(config: IGetListConfig) {
            const res = await axios.post<IListResponse>(listUrl, config)

            return res.data
        },
        async modify(config: IModifyConfig) {
            const res = await axios.post<IModifyResponse>(modifyUrl, config)

            return res.data
        }
    }
}