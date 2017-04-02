/**
 * Created by Petr on 3/19/2017.
 */
import React from 'react'
import PropertyListItem from './property-list-Item'

export default class EntityListItem extends React.Component{
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            expanded: false
        };
        // bindings
        this.handleExpand  = this.handleExpand .bind(this);
        this.handleStats = this.handleStats .bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handlePropertyAdd= this.handlePropertyAdd.bind(this);
    }
    componentDidMount() {

    }
    handleAdd() {
        console.log("add entity");
        this.props.onAdd(this.props.entity, this.props.entity.properties);
    }
    handlePropertyAdd(property) {
        console.log("add prop", property);
        this.props.onAdd(this.props.entity, [property]);
    }
    handleExpand () {
        console.log('click event expand ');
        this.setState({expanded: !this.state.expanded});
    }
    handleStats () {
        console.log('click event stats');
        alert("Info TODO...");
    }
    render() {
        let propertyList = null;
        if(this.state.expanded){
            const propertyItems = this.props.entity.properties.map(property => {
                if(property.name){
                    return (<PropertyListItem  key={`${this.props.entity.name}-${property.name}`}
                                       property={property} onAdd={this.handlePropertyAdd}  />);
                } else {
                    console.log("Invalid Property, has no name!");
                }
            });
            propertyList = <ul>{propertyItems}</ul>
        }
        return (
            <div>
                <span onClick={this.handleExpand} > + </span>
                {this.props.entity.name}
                <span onClick={this.handleStats} > i</span>
                <button onClick={this.handleAdd}>Add</button>
                {propertyList}
            </div>
        );
    }
}
EntityListItem.propTypes = {
    id: React.PropTypes.string,
    entity: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        properties: React.PropTypes.array.isRequired
    }).isRequired
};