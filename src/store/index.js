import { combineReducers, createStore } from 'redux'
import { loginReducer as login } from '../views/login/store/reducer'

const rootRecuder = combineReducers({
    login,
})

const store = createStore(rootRecuder);

export default store