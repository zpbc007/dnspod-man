import { AxiosInstance } from "axios";
import { createRecordListRequest } from './record'

export * from './apiAxios'
export function createApi(axios: AxiosInstance) {
    return {
        record: createRecordListRequest(axios)
    }
}