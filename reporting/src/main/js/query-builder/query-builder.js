/**
 * Created by Petr on 3/4/2017.
 */
import React from 'react'
import EntityContainer from '../entity/entity-container'
import ColumnContainer from '../column/column-container'
import PreviewContainer from '../preview/preview-container'
import QueryContainer from '../query/query-container'
import ConditionContainer from '../condition/condition-container'
import MenuContainer from '../menu/menu-container'
export default class QueryBuilder extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {

        //<ConditionContainer />
        return (
            <div className="vertical-container">
                <MenuContainer />
                <div className="horizontal-container">
                    <EntityContainer />
                    <div className="vertical-container">
                        <div className="horizontal-container">
                            <ColumnContainer />
                            <QueryContainer />
                        </div>
                        <PreviewContainer />
                    </div>
                </div>
            </div>
        );
    }
}