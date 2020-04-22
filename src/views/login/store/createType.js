
import Cookie from 'js-cookie'

export const ADD_COOKIE = 'ADD_COOKIE'
export const USER_INFO = 'USER_INFO'


// 登录成功之后调取，添加cookie
export const addCookie = () => {
    Cookie.set('x-token','sang')
    return {
        type: ADD_COOKIE,
        params: 'sang'
    }
}

// 登录成功之后，保存用户名
export const addUserInfo = (name) => {
    return {
        type: USER_INFO,
        params: name,
    }
}