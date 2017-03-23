/**
 * Created by Petr on 2/26/2017.
 */
'use strict';
import React from 'react'
import { render } from "react-dom"
import { Router, Route, Link, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import QueryBuilder from './query-builder/query-builder'
import store from './store/store'

class NotFound extends React.Component{
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
class App extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <header>
                    <ul className="nav navbar navbar-static-top nav-tabs">
                        <li><Link to="/reporting/home" activeClassName="active">Home</Link></li>
                        <li><Link to="/reporting/builder" activeClassName="active">Report Builder</Link></li>
                    </ul>
                </header>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
 class Home extends React.Component{
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <h2>Welcome!</h2>
        )
    }
}

/*<Redirect from="/" to="builder" />*/
const router =
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/reporting" component={App}>
                <Route path="home" component={QueryBuilder} />
                <Route path="builder" component={Home} />
                <Route path="*" component={NotFound}/>
            </Route>
            <Route path="*" component={NotFound}/>
        </Router>
    </Provider>;


render(router, document.getElementById("react"));