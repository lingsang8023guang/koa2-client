import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import { Route, NavLink } from 'react-router-dom'
import DetailPage1 from './details/page1'
import DetailPage2 from './details/page2'
import DetailPage3 from './details/page3'
import DetailPage4 from './details/page4'

const { Header, Content, Footer, Sider } = Layout;
class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentWillMount() {
        if (this.props.path === '/main') {
            this.props.history.push('/main/shopInfo')
        }    }
    render() {
        return(
            <div style={{ height: '100vh' }}>
                 <Layout style={{ height: '100%' }}>
                    <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                    >
                    <div className="logo" />
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                               <NavLink to='/main/shopInfo' className="nav-text">店铺信息</NavLink>
                            </Menu.Item>
                            <Menu.Item key="2">
                               <NavLink to='/main/foodInfo' className="nav-text">菜品管理</NavLink>
                            </Menu.Item>
                            <Menu.Item key="3">
                              <NavLink to='/main/foodCategery' className="nav-text">菜品分类</NavLink>
                            </Menu.Item>
                            <Menu.Item key="4">
                              <NavLink to='/main/foodGroup' className="nav-text">菜品分组</NavLink>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header className="site-layout-sub-header-background" style={{ padding: 0 }} />
                        <Content style={{ margin: '24px 16px 0' }}>
                            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>  
                                <Route path='/main/shopInfo' component = {DetailPage1}></Route>
                                <Route path='/main/foodInfo' component = {DetailPage2}></Route>
                                <Route path='/main/foodCategery' component = {DetailPage3}></Route>
                                <Route path='/main/foodGroup' component = {DetailPage4}></Route>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default MainPage