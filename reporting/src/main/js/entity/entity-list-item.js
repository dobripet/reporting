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
            showStatsModal: false,
            selected: this.initSelected(props)
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
        this.handlePropertySelectChange = this.handlePropertySelectChange.bind(this);
        this.initSelected = this.initSelected.bind(this);
    }
    /*componentDidMount() {
    }*/
    componentWillReceiveProps(nextProps){
        if(Object.keys(this.state.selected).length !==  Object.keys(nextProps.entity.properties).length){
            this.setState({selected: this.initSelected(nextProps)});
            console.log('props', nextProps, Object.keys(nextProps.entity.properties).length);
        }

        console.log('ttt', nextProps);
    }

    initSelected(props){
        let selected = {};
        for(let property in props.entity.properties){
            selected[property] = false;
        }
        return selected;
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
        this.props.onAdd(this.props.entity, Object.keys(this.props.entity.properties).filter(k => this.state.selected[k]).map(k => this.props.entity.properties[k]));
        this.setState({selected: this.initSelected(this.props)});
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
    handlePropertySelectChange (property) {
        console.log('pp', property);
        let selected = this.state.selected;
        selected[property] = !selected[property];
        this.setState({selected});
    }

    render() {
        const {
            entity,
            loading,
            getEntityRowCount
        } = this.props;
        //let propertyList = null;
        let propertyItems = null;
        let glyphClass = "glyphicon glyphicon-menu-down cursor-pointer";
        if(this.state.expanded){
            glyphClass = "glyphicon glyphicon-menu-up cursor-pointer";
            propertyItems = Object.keys(entity.properties).sort().map(property =>
                <PropertyListItem
                    key={`${entity.name}-${property}`}
                    getEntityPropertyStats={this.getEntityPropertyStats}
                    property={entity.properties[property]}
                    onAdd={this.handlePropertyAdd}
                    onSelectChange={this.handlePropertySelectChange}
                    getEntityRowCount={getEntityRowCount}
                    entityName={entity.name}
                    rowCount={entity.rowCount}
                    loading={loading}
                    selected={this.state.selected[property]}
                />);
            //propertyList = {propertyItems}
        }
        //console.log('selected', this.state.selected);
        let stats = null;
        //entity && entity.name === 'Warehouses' ||
        if(this.state.showStatsTooltip){
            stats = <EntityStatsTooltip entity={entity} getEntityRowCount={getEntityRowCount}/>;
        }
        if(this.state.showStatsModal){
            stats = <EntityStatsModal entity={entity} onClose={this.handleCloseModal} getEntityRowCount={getEntityRowCount}/>;
        }
        return (
            <div className="list-item">
                <span onClick={this.handleExpand} className={glyphClass}></span>
                <span onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave}
                      onClick={this.handleExpand} className="custom-item cursor-pointer" style={{fontSize:"18px"}}>{entity.name}</span>
                <span onClick={this.handleStats} className="custom-item glyphicon glyphicon-info-sign cursor-pointer primary-color" style={{fontSize:"18px"}}></span>
                <button onClick={this.handleAdd} className="custom-item btn btn-primary btn-xs" style={{verticalAlign:"text-bottom"}}>
                    <span className="glyphicon glyphicon-plus-sign cursor-pointer"></span><span className="custom-item">All</span></button>
                {stats}
                {propertyItems}
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