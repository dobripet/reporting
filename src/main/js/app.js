/**
 * Created by Petr on 2/26/2017.
 */
'use strict';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
//import client from './client';
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {employees: []};
    }
    /*
    componentDidMount() {
        client({method: 'GET', path: '/api/employees'}).done(response => {
            this.setState({employees: response.entity._embedded.employees});
    });
    }*/

    render() {
        return (
            <h1>Hello from React</h1>
        )
    }
}
ReactDOM.render( <App />, document.getElementById('react'));