import { fromJS, set } from 'immutable'
import Cookie from 'js-cookie'

import { ADD_COOKIE, USER_INFO } from './createType'

const defaultState = fromJS({
    xToken: Cookie.get('x-token') || '',
    userName: '',
})

export function loginReducer(state = defaultState, actions) {
    switch (actions.type) {
        case ADD_COOKIE:
          return state.set('xToken', fromJS(actions.params));
        case USER_INFO:
          return state.set('userName', fromJS(actions.params));
        default:
          return state
      }
}