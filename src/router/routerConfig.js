import MainPage from "../views/main"

// 放置一级路由，用于区分登录校验，动态角色设置不同路由
// 二级路由，不设置component,方便二级路由组件内设置 位置
const routes = [
    {
        path: '/',
        routes: [
            {
                path: '/login',
                component: 'views/login',
            },
            {
                path: '/register',
                component: 'views/register',
            },
            {
                path: '/main',
                component: 'views/main',
                key: 'main',
                routes: [
                    {
                        path: '/main/shopInfo',
                        // component: 'views/main/details/page1',
                    },
                    {
                        path: '/main/foodInfo',
                        // component: 'views/main/details/page2',
                    },
                    {
                        path: '/main/foodCategery',
                        // component: 'views/main/details/page3',
                    },
                    {
                        path: '/main/foodGroup',
                        // component: 'views/main/details/page4',
                    },
                ]
            },
            {
                path: '/error',
                component: 'views/error',
            },
        ]
    },
]
 
export default routes
