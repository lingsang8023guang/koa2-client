import MainPage from "../views/main"

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
                key: 'main',
                children: [
                    {
                        path: '/main/shopInfo',
                        component: 'views/main/details/page1',
                    },
                    {
                        path: '/main/foodInfo',
                        component: 'views/main/details/page2',
                    },
                    {
                        path: '/main/foodCategery',
                        component: 'views/main/details/page3',
                    },
                    {
                        path: '/main/foodGroup',
                        component: 'views/main/details/page4',
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
