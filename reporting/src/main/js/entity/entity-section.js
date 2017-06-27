import React from 'react'
import Loader from '../utils/custom-loader'
import _ from 'lodash'
import Search from './search'
import EntityListItem from './entity-list-item'


import {initState} from '../test/storeMock'

export default class EntitySection extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.doSearch = _.debounce(props.searchEntityList, 500);
        this.handleAddProperty  = this.handleAddProperty.bind(this);
        this.getEntityRowCount = this.getEntityRowCount.bind(this);
        this.getEntityPropertyStats = this.getEntityPropertyStats.bind(this);
    }
    componentDidMount() {
        //this.searchInput.focus();
        console.log("testing fetch");
        this.props.fetchEntityList();
    }
    getEntityRowCount(name){
        this.props.getEntityRowCount(name);
    }

    getEntityPropertyStats(entityName, propertyName){
        this.props.getEntityPropertyStats(entityName, propertyName);
    }
    handleAddProperty (entity, properties){
        console.log(entity, properties);
        this.props.addPropertiesToColumnList(entity, properties);
    }
    render() {
        const {
            entities,
            search,
            loading,
            statsLoading,
            error
        } = this.props;

        console.log('data', initState);
        //basic error handling
        if(error){
            console.log(error);
            return (<div className="entity-section"><h1>{error}</h1></div>);
        }
        let entityList = <span>No entity or column found!</span>;
        //filtering
        let filtered = entities;
        if(search) {
            const text = search.toLowerCase();
            filtered = {};
            for(let entity in entities){
                if(entities[entity].name.toLowerCase().includes(text) ||
                    Object.keys(entities[entity].properties).filter(property => property.toLowerCase().includes(text)).length > 0){
                    filtered[entities[entity].name] = entities[entity];
                }
            }
        }
        //sorting and mapping
        if(Object.keys(filtered).length > 0) {
            entityList = Object.keys(filtered).sort().map(entityName =>
                <EntityListItem
                    key={entityName}
                    entity={filtered[entityName]}
                    onAdd={this.handleAddProperty}
                    getEntityRowCount={this.props.getEntityRowCount}
                    getEntityPropertyStats={this.getEntityPropertyStats}
                    loading={statsLoading}

                />);
        }
        console.log(this.getEntityRowCount);
        console.log("loading ", statsLoading);
        return (
            <div className="entity-section">
                <div className="scrollable-content">
                <Loader show={loading}>
                    <Search id="search-input" placeholder="Search table or column" onChange={this.doSearch} focus={true}/>
                        {entityList}
                </Loader>
                </div>
            </div>

        );
    }
}
EntitySection.PropTypes={
    entities: React.PropTypes.object.isRequired
};