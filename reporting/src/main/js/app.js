/**
 * Entry point
 *
 * Created by Petr on 2/26/2017.
 */
'use strict';
import React from 'react'
import {render} from "react-dom"
import {Router, Route, browserHistory, IndexRoute} from 'react-router'
import {Provider} from 'react-redux'
import QueryBuilderContainer from './query-builder/query-builder-container'
import store from './store/store'

class NotFound extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <div className="jumbotron">
            <h1>404 - Page not found</h1>
            <p>
                The page you're looking for doesn't seem to exist.
            </p>
        </div>;
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="application">
                {this.props.children}
            </div>
        )
    }
}
const router =
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/reporting" component={App}>
                <IndexRoute component={QueryBuilderContainer}/>
            </Route>
            <Route path="*" component={NotFound}/>
        </Router>
    </Provider>;

render(router, document.getElementById("react"));