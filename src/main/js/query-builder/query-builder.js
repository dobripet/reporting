/**
 * Created by Petr on 3/4/2017.
 */
import React from 'react';
import EntityContainer from '../entity/entity-container';

export default class QueryBuilder extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>Tohle je query builder
                <EntityContainer />
            </div>
        );
    }
}