// 放置一级路由，用于区分登录校验，动态角色设置不同路由
const routes = [
    {
        path: '/',
        // component: 'views/main',
        routes: [
            {
                path: '/login',
                component: 'views/login',
            },
            {
                path: '/main',
                component: 'views/main',
            },
            {
                path: '/main/page1',
                component: 'views/main/details/page1',
            },
            {
                path: '/main/page2',
                component: 'views/main/details/page2',
            },
            {
                path: '/main/page3',
                component: 'views/main/details/page3',
            },
            {
                path: '/main/page4',
                component: 'views/main/details/page4',
            },
            {
                path: '/error',
                component: 'views/error',
            },
        ]
    },
]
 
export default routes
