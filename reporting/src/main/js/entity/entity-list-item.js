import React from 'react'
import PropertyListItem from './property/property-list-Item'
import EntityStatsTooltip from './entity-stats-tooltip'
import EntityStatsModal from './entity-stats-modal'

export default class EntityListItem extends React.Component{
    constructor(props) {
        super(props);
        //initial state
        this.state = {
            expanded: false,
            showStatsTooltip: false,
            showStatsModal: false
        };
        // bindings
        this.handleExpand  = this.handleExpand.bind(this);
        this.handleStats = this.handleStats.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handlePropertyAdd= this.handlePropertyAdd.bind(this);
        this.handleMouseOver= this.handleMouseOver.bind(this);
        this.handleMouseLeave= this.handleMouseLeave.bind(this);
        this.handleCloseModal= this.handleCloseModal.bind(this);
        this.showStatsTooltip = this.showStatsTooltip.bind(this);
        this.showStatsModal = this.showStatsModal.bind(this);
        this.hideStatsTooltip = this.hideStatsTooltip.bind(this);
        this.hideStatsModal = this.hideStatsModal.bind(this);
        this.getEntityPropertyStats = this.getEntityPropertyStats.bind(this);
    }
    componentDidMount() {

    }
    getEntityPropertyStats(propertyName){
        this.props.getEntityPropertyStats(this.props.entity.name, propertyName);
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
        console.log("add entity");
        //little workaround to add multiple properties
        this.props.onAdd(this.props.entity, Object.keys(this.props.entity.properties).map(k => this.props.entity.properties[k]));
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
        const {
            entity,
            loading,
            getEntityRowCount
        } = this.props;
        let propertyList = null;
        if(this.state.expanded){
            const propertyItems = Object.keys(entity.properties).sort().map(property =>
                <PropertyListItem
                    key={`${entity.name}-${property}`}
                    getEntityPropertyStats={this.getEntityPropertyStats}
                    property={entity.properties[property]}
                    onAdd={this.handlePropertyAdd}
                    loading={loading}
                />);
            propertyList = <ul>{propertyItems}</ul>
        }
        let stats = null;
        if(this.state.showStatsTooltip){
            stats = <EntityStatsTooltip entity={entity} getEntityRowCount={getEntityRowCount}/>;
        }
        if(this.state.showStatsModal){
            stats = <EntityStatsModal entity={entity} onClose={this.handleCloseModal} getEntityRowCount={getEntityRowCount}/>;
        }
        return (
            <div>
                <span onClick={this.handleExpand} > + </span>
                <span onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}>{entity.name}</span>
                <span onClick={this.handleStats} > iiii</span>
                <button onClick={this.handleAdd}>Add</button>
                {stats}
                {propertyList}
            </div>
        );
    }
}
EntityListItem.propTypes = {
    id: React.PropTypes.string,
    entity: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        properties: React.PropTypes.objectOf(
              React.PropTypes.shape({
                    name: React.PropTypes.string.isRequired,
                    dataType: React.PropTypes.string.isRequired
                }))
    }).isRequired,
    getEntityRowCount: React.PropTypes.func.isRequired,
    getEntityPropertyStats: React.PropTypes.func.isRequired
};