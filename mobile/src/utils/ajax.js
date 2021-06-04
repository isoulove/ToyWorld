import 'isomorphic-fetch'
import { Toast } from 'antd-mobile'

const BASE_URL = ''

/**
 * 处理url
 * @param url
 * @param param
 * @returns {*}
 */
 function handleURL (url, param) {
    let completeUrl = BASE_URL + url
    if (param) {
        if (completeUrl.indexOf('?') === -1) {
            completeUrl = `${completeUrl}?${ObjToURLString(param)}`
        } else {
            completeUrl = `${completeUrl}&${ObjToURLString(param)}`
        }
    }
    return completeUrl
}

/**
 * 将参数对象转化为'test=1&test2=2'这种字符串形式
 * @param param
 * @returns {string}
 * @constructor
 */
function ObjToURLString (param) {
    let str = ''
    if (Object.prototype.toString.call(param) === '[object Object]') {
        const list = Object.entries(param).map(item => {
            return `${item[0]}=${item[1]}`
        })
        str = list.join('&')
    }
    return str
}

export async function getRequest (url,param){
    const completeUrl = handleURL(url, param)
    const response = await fetch(completeUrl,{
        credentials: 'include',
        xhrFields: {
            withCredentials: true       //跨域
        },
    })

    if (response.ok) {
        return response.json()
    } else {
        Toast.offline(response.statusText || '网络错误')
        return response
    }

}

export async function postRequest (url, param) {
    const response = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            Accept: "application/json", //
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(param),
    })
    if (response.ok) {
        return response.json()
    } else {
        Toast.offline(response.statusText || '网络错误')
        return response
    }
}
