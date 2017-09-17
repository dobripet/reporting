import React from 'react'
import Loader from 'react-loader'
import {normalizeForTableCell} from '../utils/utils'

export default class PreviewSection extends React.Component{
    constructor(props) {
        super(props);
        // bindings
       /* this.handleRemove = this.handleRemove.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleSetAggregateFunction = this.handleSetAggregateFunction.bind(this);*/
    }
    /*handleRemove (columnIndex){
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
    }*/
    render() {
        const{
            data,
            loading,
            columnNames
        } = this.props;
        /*let columns = <span>Add columns to build query!</span>;
        if(this.props.columns.length > 0) {
            columns = this.props.columns.map((column, index) => <ColumnListItem
                key={index}
                column={column}
                index={index}
                onRemove={this.handleRemove}
                onEditTitle={this.handleEditTitle}
                onSetAggregateFunction={this.handleSetAggregateFunction}
                />);
            columns = <table>
                    <thead>
                        <tr>
                            <th>Column</th>
                            <th>Title</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {columns}
                    </tbody>
                </table>
        }*/
        console.log('preview', data);
        let header = columnNames.map((name, i) => <th key={i}>{name}</th>);
        let rows = null;
        if(data) {
            rows = data.map((row, i) => {
                if (Array.isArray(row)) {
                    let columns = row.map((column, j) => <td key={j}>{normalizeForTableCell(column)}</td>);
                    return <tr key={i}>{columns}</tr>;
                } else {
                    return <tr key={i}>
                        <td>{normalizeForTableCell(row)}</td>
                    </tr>
                }
            });
        }
        return (
            <div className="preview-section">
                <Loader loaded={!loading}>
                    <table className="table-bordered">
                        <caption>Preview</caption>
                        <thead>
                            <tr>
                                {header}
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                </Loader>
            </div>

        );
    }
}
PreviewSection.PropTypes={
    data: React.PropTypes.array.isRequired
};