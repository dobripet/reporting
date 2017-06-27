import React from 'react'
import Loader from 'react-loader'
import ColumnListItem from './column-list-item'
import JoinModal from '../join/join-modal'


export default class ColumnSection extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        this.handleRemove = this.handleRemove.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleSetAggregateFunction = this.handleSetAggregateFunction.bind(this);
    }
    handleRemove (columnIndex){
        console.log("remove ", columnIndex);
        this.props.removeColumnFromColumnList(columnIndex);
    }
    handleEditTitle (columnIndex, title){
        console.log("edit ", title);
        this.props.editColumnTitle(columnIndex, title);
        //this.props.removeColumnFromColumnList(title);
    }
    handleSetAggregateFunction(columnIndex, aggregateFunction){
        this.props.setAggregateFunction(columnIndex, aggregateFunction);
    }
    render() {
        const {
            columns,
            showJoinModal,
            joinParameters
        } = this.props;
        let columnsTable = <span>Add columns to build query!</span>;
        if(columns.length > 0) {
            columnsTable = columns.map((column, index) => <ColumnListItem
                key={index}
                column={column}
                index={index}
                onRemove={this.handleRemove}
                onEditTitle={this.handleEditTitle}
                onSetAggregateFunction={this.handleSetAggregateFunction}
                />);
            columnsTable = <table>
                    <thead>
                        <tr>
                            <th>Column</th>
                            <th>Title</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {columnsTable}
                    </tbody>
                </table>
        }
        let joinModal = null;
        if(typeof(showJoinModal) != 'undefined' && showJoinModal != null){
            joinModal = <JoinModal joinParameters ={joinParameters[showJoinModal]} />
        }
        return (
            <div className="column-section">
                <Loader loaded={!this.props.loading}>
                    {joinModal}
                    {columnsTable}
                </Loader>
            </div>

        );
    }
}
ColumnSection.PropTypes={
            columns: React.PropTypes.array.isRequired,
            joinParameters: React.PropTypes.array.isRequired
};