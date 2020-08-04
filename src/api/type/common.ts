// 通用请求体
export interface ICommonRequestBody {
    // 用于鉴权的 API Token
    login_token: string
    // 返回的数据格式，可选，默认为xml，建议用json
    format: 'xml' | 'json'
    // 返回的错误语言，可选，默认为en，建议用cn
    lang: 'en' | 'cn'
    // 没有数据时是否返回错误，可选，默认为yes，建议用no
    error_on_empty: 'yes' | 'no'
    // 用户的ID，可选，仅代理接口需要， 用户接口不需要提交此参数
    user_id?: string
}

export interface ICommonResponse {
    status: {
        code: keyof typeof ErrorCodeMap
        message: string
        created_at: string
    }
}

export const ErrorCodeMap = {
    '-1': '登陆失败',
    '-2': 'API使用超出限制',
    '-3': '不是合法代理 (仅用于代理接口)',
    '-4': '不在代理名下 (仅用于代理接口)',
    '-7': '无权使用此接口',
    '-8': '登录失败次数过多，帐号被暂时封禁',
    '-85': '帐号异地登录，请求被拒绝',
    '-99': '此功能暂停开放，请稍候重试',
    '1': '操作成功',
    '2': '只允许POST方法',
    '3': '未知错误',
    '6': '用户ID错误 (仅用于代理接口)',
    '7': '用户不在您名下 (仅用于代理接口)',
    '83': '该帐户已经被锁定，无法进行任何操作',
    '85': '该帐户开启了登录区域保护，当前IP不在允许的区域内',
}