/**
 * Created by Petr on 3/4/2017.
 */
import React from 'react'
import EntityContainer from '../entity/entity-container'
import ColumnContainer from '../column/column-container'
import ConditionContainer from '../condition/condition-container'
import MenuContainer from '../menu/menu-container'
export default class QueryBuilder extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="vertical-container">
                <MenuContainer />
                <div className="horizontal-container">
                    <EntityContainer />
                    <div className="vertical-container">
                        <ColumnContainer />
                        <ConditionContainer />
                    </div>
                </div>
            </div>
        );
    }
}