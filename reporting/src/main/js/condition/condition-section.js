import React from 'react'
import Loader from 'react-loader'
//import ConditionListItem from './Condition-list-item'


export default class ConditionSection extends React.Component{
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            showMenu: false
        };
        // bindings
        this.handleRemove = this.handleRemove.bind(this);
        this.handleOpenConditionMenu = this.handleOpenConditionMenu.bind(this);
        //this.handleEditTitle = this.handleEditTitle.bind(this);
        //this.handleSetAggregateFunction = this.handleSetAggregateFunction.bind(this);
    }
    handleRemove (conditionIndex){
        console.log("remove ", conditionIndex);
       // this.props.removeConditionFromConditionList(conditionIndex);
    }
    handleOpenConditionMenu(){
        this.setState({showMenu: true});
    }
    /*handleEditTitle (conditionIndex, title){
        console.log("edit ", title);
        this.props.editConditionTitle(ConditionIndex, title);
        //this.props.removeConditionFromConditionList(title);
    }
    handleSetAggregateFunction(ConditionIndex, aggregateFunction){
        this.props.setAggregateFunction(ConditionIndex, aggregateFunction);
    }*/
    render() {
        return (
            <div className="condition-section">
                <Loader loaded={!this.props.loading}>
                    <button>Add Condition</button><br/>
                    Tab1 Col1  <select>
                    <option value="0">is equal to</option>
                    <option value="1">is greater than</option>
                    <option value="2">is less than</option>
                    <option value="3">is between</option>
                </select>
                    <input type="text"/>
                    TODO functionality
                </Loader>
            </div>

        );
    }
}
ConditionSection.PropTypes={
    Conditions: React.PropTypes.array.isRequired
};