import React from 'react'
import Loader from 'react-loader'


export default class QuerySection extends React.Component{
    constructor(props) {
        super(props);
        // bindings
        /*this.handleRemove = this.handleRemove.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleSetAggregateFunction = this.handleSetAggregateFunction.bind(this);*/
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.dirty && !nextProps.loading){
            setTimeout(this.props.update(), 50);
        }
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
        const {
            query,
            loading
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
        console.log(query);
        return (
            <div className="query-section">
                <Loader loaded={!loading}>
                    {query}
                </Loader>
            </div>

        );
    }
}
QuerySection.PropTypes={
    query: React.PropTypes.string.isRequired
};