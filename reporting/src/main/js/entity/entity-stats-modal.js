import React from 'react'
export default class EntityStatsModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        //this.searchInput.focus();
        console.log("testing fetch");
        this.props.getEntityRowCount(this.props.entity.name);
    }
    handleClose(){
        this.props.onClose();
    }
    render(){
        console.log(this.props.entity.schemaUrl);
        console.log(this.props.entity.tableUrl);
        // do referred by list with columns
        let referred = "No tables found.";
        if(this.props.entity.referredByMap && Object.keys(this.props.entity.referredByMap).length > 0 ){
            //map all referredBy tables
            console.log("jsem tu");
            let rows = Object.keys(this.props.entity.referredByMap).map(tableName => {
                //map every foreign key of given table
                console.log("tableName", tableName);
                let keys =  this.props.entity.referredByMap[tableName].map((fk, i) => {
                    let localKeys = fk.localColumnNames.join(', ');
                    let foreignKeys = fk.foreignColumnNames.join(', ');
                    return <li key={i} >{foreignKeys} -> {localKeys}</li>
                });
                console.log(keys);
                return <li key={tableName}>{tableName}<ul>{keys}</ul></li>;
            });
            referred = <ul>{rows}</ul>;
        }

        // do reference list with columns
        let reference = "No tables found.";
        if(this.props.entity.referenceMap && Object.keys(this.props.entity.referenceMap).length > 0 ){
            //map all referredBy tables
            //console.log("jsem tu");
            let rows = Object.keys(this.props.entity.referenceMap).map(tableName => {
                //map every foreign key of given table
                //console.log("tableName", tableName);
                let keys =  this.props.entity.referenceMap[tableName].map((fk, i) => {
                    let localKeys = fk.localColumnNames.join(', ');
                    let foreignKeys = fk.foreignColumnNames.join(', ');
                    return <li key={i} >{localKeys} -> {foreignKeys} </li>
                });
                console.log(keys);
                return <li key={tableName}>{tableName}<ul>{keys}</ul></li>;
            });
            reference = <ul>{rows}</ul>;
        }
        //documentation links
        let schemaUrl = null;
        if(this.props.entity.schemaUrl) {
            schemaUrl = <tr><td>Schema: </td><td><a href={this.props.entity.schemaUrl}>{this.props.entity.schemaUrl}</a></td></tr>
        }
        let tableUrl = null;
        if(this.props.entity.tableUrl) {
            tableUrl = <tr><td>Table: </td><td><a href={this.props.entity.tableUrl}>{this.props.entity.tableUrl}</a></td></tr>
        }
        return (
            <div className="entity-modal-container">
                <div className="entity-modal">
                    <h3>{this.props.entity.name}</h3>
                    <table>
                        <tbody>
                        {tableUrl}
                        {schemaUrl}
                        <tr>
                            <td>Count:</td>
                            <td>{this.props.entity.rowCount}</td>
                        </tr>
                        <tr>
                            <td>Tags:</td>
                            <td>TODO</td>
                        </tr>
                        </tbody>
                    </table>
                    <h4>Referred by:</h4>
                    {referred}
                    <h4>Reference:</h4>
                    {reference}
                    <button onClick={this.handleClose}>Close</button>
                </div>
            </div>
        )
    }
}

EntityStatsModal.propTypes = {
    entity: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        properties: React.PropTypes.objectOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                dataType: React.PropTypes.string.isRequired
            })),
        schemaUrl: React.PropTypes.string,
        tableUrl: React.PropTypes.string.isRequired,
        referredByMap: React.PropTypes.objectOf(
            React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    foreignColumnNames: React.PropTypes.array,
                    localColumnNames: React.PropTypes.array
                }))),
        referenceMap: React.PropTypes.objectOf(
            React.PropTypes.arrayOf(
                React.PropTypes.shape({
                    foreignColumnNames: React.PropTypes.array,
                    localColumnNames: React.PropTypes.array
                })))
    }).isRequired,
    getEntityRowCount: React.PropTypes.func.isRequired
};