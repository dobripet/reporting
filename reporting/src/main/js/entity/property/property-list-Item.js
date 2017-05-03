/**
 * Created by Petr on 3/19/2017.
 */
import React from 'react'

import PropertyStatsTooltip from './property-stats-tooltip'
import PropertyStatsModal from './property-stats-modal'

export default class PropertyListItem extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showStatsTooltip: false,
            showStatsModal: false
        };
        // bindings
        this.handleStats = this.handleStats.bind(this);
        this.handleAdd = this.handleAdd.bind(this);

        this.handleMouseOver= this.handleMouseOver.bind(this);
        this.handleMouseLeave= this.handleMouseLeave.bind(this);
        this.handleCloseModal= this.handleCloseModal.bind(this);
        this.showStatsTooltip = this.showStatsTooltip.bind(this);
        this.showStatsModal = this.showStatsModal.bind(this);
        this.hideStatsTooltip = this.hideStatsTooltip.bind(this);
        this.hideStatsModal = this.hideStatsModal.bind(this);
    }
    showStatsTooltip(){
        this.setState({showStatsTooltip: true});
    }
    hideStatsTooltip(){
        this.setState({showStatsTooltip: false});
    }
    showStatsModal(){
        this.setState({showStatsModal: true});
    }
    hideStatsModal(){
        this.setState({showStatsModal: false});
    }

    handleAdd() {
        console.log("add");
        this.props.onAdd(this.props.property);
    }
    handleStats () {
        console.log('click event stats');
        this.setState({showStatsModal: true});
    }

    handleMouseOver () {
        //console.log("mouseover");
        const timeout = setTimeout(this.showStatsTooltip, 400);
        this.setState({timeout});
    }

    handleMouseLeave () {
        //console.log("mouseleave");
        if(this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
        this.setState({timeout: null});
        this.hideStatsTooltip();
    }

    handleCloseModal () {
        console.log("close modal");
        this.hideStatsModal();
    }
    render() {
        let stats = null;
        if(this.state.showStatsTooltip){
            stats = <PropertyStatsTooltip property={this.props.property} />;
        }
        console.log(this.props.getEntityRowCount);
        if(this.state.showStatsModal){
            stats = <PropertyStatsModal property={this.props.property} onClose={this.handleCloseModal} getEntityPropertyStats={this.props.getEntityPropertyStats}/>;
        }
        return (
            <li>
                <span onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>{this.props.property.name}</span>
                <span onClick={this.handleStats} > info</span>
                <button onClick={this.handleAdd}>Add</button>
                {stats}
            </li>
        );
    }
}
PropertyListItem.propTypes = {
    id: React.PropTypes.string,
    property: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired
    }).isRequired,
    onAdd: React.PropTypes.func.isRequired,
    getEntityPropertyStats: React.PropTypes.func.isRequired
};