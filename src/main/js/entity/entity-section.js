/**
 * Created by Petr on 3/4/2017.
 */
import React from 'react'
import Loader from 'react-loader'
import _ from 'lodash'
import Search from './search'
import EntityListItem from './entity-list-item'

export default class EntitySection extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.doSearch = _.debounce(props.searchEntityList, 500);
        this.handleAddProperty  = this.handleAddProperty.bind(this);
    }
    componentDidMount() {
        //this.searchInput.focus();
        console.log("testing fetch");
        this.props.fetchEntityList();
    }
    handleAddProperty (entity, properties){
        console.log(entity, properties);
        this.props.addPropertiesToColumnList(entity, properties);
    }
    render() {
        let entities = <span>No entity or column found!</span>;
        if(this.props.entities.length > 0) {
            entities = this.props.entities.map(entity => <EntityListItem key={entity.name} entity={entity} onAdd={this.handleAddProperty}/>);
        }
        return (
            <div className="entity-section">
                <Loader loaded={!this.props.loading}>
                    <Search id="search-input" placeholder="Search table or column" onChange={this.doSearch} focus={true}/>
                    {entities}
                </Loader>
            </div>

        );
    }
}
EntitySection.PropTypes={
    entities: React.PropTypes.array.isRequired
};