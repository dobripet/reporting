import React from 'react'
import ColumnListItem from './column-list-item'
import JoinModal from '../join/join-modal'

/**
 * Column section component, contains all added properties
 *
 * Created by Petr on 3/21/2017.
 */
export default class ColumnSection extends React.Component {
    constructor(props) {
        super(props);
        // bindings
        this.handleRemove = this.handleRemove.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
    }

    handleRemove(columnIndex) {
        this.props.removeColumnFromColumnList(columnIndex);
    }

    handleEditTitle(columnIndex, title) {
        this.props.editColumnTitle(columnIndex, title);
    }

    render() {
        const {
            columns,
            showJoinModal,
            joinParameters
        } = this.props;
        let columnsTable = <span>Add columns to build query!</span>;
        if (columns.length > 0) {
            columnsTable = columns.map((column, index) => <ColumnListItem
                key={index}
                column={column}
                index={index}
                onRemove={this.handleRemove}
                onEditTitle={this.handleEditTitle}
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
        if (typeof(showJoinModal) != 'undefined' && showJoinModal != null) {
            joinModal = <JoinModal joinParameters={joinParameters[showJoinModal]}/>
        }
        return (
            <div className="column-section">
                {joinModal}
                {columnsTable}
            </div>

        );
    }
}
ColumnSection.PropTypes = {
    columns: React.PropTypes.array.isRequired,
    joinParameters: React.PropTypes.array.isRequired
};