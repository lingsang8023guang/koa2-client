import React from 'react'
import RouterGuard from './routerGuard'
import { Route } from 'react-router-dom'
const renderRoutesMap = (routes) => (
    routes.map((route, index) => {
        return (
            <Route key={index} path={route.path} render={props => (
                <RouterGuard {...route} {...props} />
            )}
            />
        )
    })
)

export default renderRoutesMap
