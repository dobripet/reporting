import React from 'react'
export default class PropertyStatsModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        //this.searchInput.focus();
        console.log("fetch dobrty");
        this.props.getEntityPropertyStats(this.props.property.name);
    }
    handleClose(){
        this.props.onClose();
    }
    render(){
        /*console.log(this.props.entity.schemaUrl);
        console.log(this.props.entity.tableUrl);*/
        // do referred by list with columns
        /*let referred = "No tables found.";
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
        */
        // do reference list with columns
        //let reference = "No tables found.";
        /*if(this.props.entity.referenceMap && Object.keys(this.props.entity.referenceMap).length > 0 ){
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
        }*/
        //documentation links
        /* let schemaUrl = null;
        if(this.props.entity.schemaUrl) {
            schemaUrl = <tr><td>Schema: </td><td><a href={this.props.entity.schemaUrl}>{this.props.entity.schemaUrl}</a></td></tr>
        }
        let tableUrl = null;
        if(this.props.entity.tableUrl) {
            tableUrl = <tr><td>Table: </td><td><a href={this.props.entity.tableUrl}>{this.props.entity.tableUrl}</a></td></tr>
        }*/
        let notNull = null;
        if(this.props.property.notNull){
           notNull = "Not Null"
        }
        let enumConstraints = null;
        if(this.props.property.enumConstraints){
            let values = this.props.property.enumConstraints.map(value => <li>{value}</li>);
            enumConstraints = <tr>
                    <td>Allowed values: </td>
                    <td><ul>{values}</ul></td>
                </tr>
        }
        return (
            <div className="entity-modal-container">
                <div className="entity-modal">
                    <h3>{this.props.property.name}</h3>
                    {notNull}
                    <table>
                        <tbody>
                        <tr>
                            <td>Count:</td>
                            <td>{this.props.rowCount}</td>
                        </tr>
                        <tr>
                            <td>Type:</td>
                            <td>{this.props.property.dataType}</td>
                        </tr>
                        {enumConstraints}
                        <tr>
                            <td>Tags:</td>
                            <td>TODO</td>
                        </tr>
                        </tbody>
                    </table>
                    <button onClick={this.handleClose}>Close</button>
                </div>
            </div>
        )
    }
}

PropertyStatsModal.propTypes = {
    property: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        dataType: React.PropTypes.string.isRequired,
        enumConstraints: React.PropTypes.array
    }).isRequired,
    getEntityPropertyStats: React.PropTypes.func.isRequired
};