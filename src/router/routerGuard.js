import React, { Component } from 'react'
import renderRoutesMap from './renderRoutesMap'
import Loadable from 'react-loadable'
import Cookie from 'js-cookie'

const mapStateToProps = state => (state)
const mapDispatchToProps = dispatch => ({ ...dispatch })
 
/**
 * 用到一个Loadable的插件，他的作用就是用于加载具有动态导入的组件的更高阶组件，提升用户体验
 * 在这里，才用的import，improt是不支持变量的，所以我这里用的是模版字符串的方式，在每一次进入组件，
 * 并准备render的时候，才去import该组件，这样，可以在每一次渲染的时候不用浪费资源，也可以保证首次渲染的速度变快
 */
class RouterGuard extends Component {
    constructor(props) {
        super(props)
        this.LoadableComponent = null;
    }
    componentWillMount() {
        let { history: { replace }, authorization, location, component } = this.props;
        let cookie = Cookie.get('x-token');
        if (location.pathname !== '/login' && cookie !== 'sang') {
            replace('/login')
        }

        if (cookie === 'sang' && location.pathname === '/') {
            replace('/main')
        }
        this.LoadableComponent = Loadable({
            loader: () => import(`../${component}`),
            loading: () => (
                <span></span>
            )
        })

        console.log('路由跳转前的拦截', this.props)
    }
    render() {
        let { component, routes = [] } = this.props
        
        return (
            <div>
                <this.LoadableComponent {...this.props} />
                {renderRoutesMap(routes)}
            </div>
 
        )
    }
}
 
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RouterGuard))

export default RouterGuard