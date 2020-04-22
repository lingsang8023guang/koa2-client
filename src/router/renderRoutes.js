
import React from 'react'
import renderRoutesMap from './renderRoutesMap'
import { Switch, BrowserRouter as Router } from 'react-router-dom'

const renderRoutes = ({ routes, extraProps = {}, switchProps = {} }) => (
    <Router>
        <Switch {...switchProps}>
            {renderRoutesMap(routes)}
        </Switch>
    </Router>
)
 
export default renderRoutes
