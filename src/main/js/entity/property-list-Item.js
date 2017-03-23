/**
 * Created by Petr on 3/19/2017.
 */
import React from 'react'

export default class PropertyListItem extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.handleStats = this.handleStats .bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }
    handleAdd() {
        console.log("add");
        this.props.onAdd(this.props.property);
    }
    handleStats () {
        console.log('click event stats');
        alert("Info TODO...");
    }
    render() {
        return (
            <li>
                {this.props.property.name}
                <span onClick={this.handleStats} > info</span>
                <button onClick={this.handleAdd}>Add</button>
            </li>
        );
    }
}
PropertyListItem.propTypes = {
    id: React.PropTypes.string,
    property: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired
    }).isRequired,
    onAdd: React.PropTypes.func.isRequired
};