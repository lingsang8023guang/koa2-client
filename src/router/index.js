import React from 'react'
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom'
import renderRoutes from './renderRoutes'
import routerConfig from './routerConfig'

// 在这里做路由拦截器
/**
 * 1. 最笨的方法，在这获取store里面的role或者cookie-Tooken，然后动态渲染
 * 2. 在每个需要路由判断的组件内用withRouter包一下，this.props.router.setRouteLeaveHook 来判断,react-router3.XX版本
 * 2. 在外面设置routerConfig,整个路由部分动态配置
 */
const BasicRoute = () => (
    <BrowserRouter>
        {/*<Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/details" component={Details}/>
            <Route exact path="/login" component={Login}/>
        </Switch>*/}
        {
            renderRoutes({
                routes: routerConfig
            })        
        }
    </BrowserRouter>
);
export default BasicRoute