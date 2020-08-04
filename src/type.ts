import { ICreateApiAxiosConfig } from "./api";

export interface IGlobalConfig extends ICreateApiAxiosConfig {
    // 域名
    domain: string
    // 要更新的子域名
    subDomain: string
}