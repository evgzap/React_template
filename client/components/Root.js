import React, { lazy, Suspense } from "react";
import { Router, Route, Switch } from "react-router-dom";

const customHistory = require("history").createBrowserHistory();

import Index from './routes/Index'

export default class Root extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <Router history={customHistory} >
                <Suspense fallback={''}>
                    <Switch>
                    <Route exact path='/' component={Index} />
                    </Switch>
                </Suspense>
            </Router>
        )
    }
}