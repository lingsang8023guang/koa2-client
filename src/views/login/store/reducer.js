import { fromJS } from 'immutable'
import Cookie from 'js-cookie'

import { ADD_COOKIE, USER_INFO } from './createType'

const defaultState = fromJS({
    xToken: Cookie.get('x-token') || '',
    userName: 'ddd',
})

export function loginReducer(state = defaultState, actions) {
    switch (actions.type) {
        case ADD_COOKIE:
          return Object.assign({}, state, { xToken: actions.params })
        case USER_INFO:
          return Object.assign({}, state, { userName: actions.params }) 
        default:
          return state
      }
}