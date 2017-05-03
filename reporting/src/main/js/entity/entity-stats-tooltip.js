import React from 'react'
export default class EntityStatsTooltip extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
    }

    componentDidMount() {
        //this.searchInput.focus();
        console.log("testing fetch");
        this.props.getEntityRowCount(this.props.entity.name);
    }
    render(){
        // od referred by list
        let referred = "No tables found.";
        if(this.props.entity.referredByMap && Object.keys(this.props.entity.referredByMap).length > 0 ){
            let rows = Object.keys(this.props.entity.referredByMap).map(tableName => <li key={tableName} >{tableName}</li> );
            referred = <ul>{rows}</ul>;
        }
        // do reference list
        let reference = "No tables found.";
        if(this.props.entity.referenceMap && Object.keys(this.props.entity.referenceMap).length > 0 ){
            let rows = Object.keys(this.props.entity.referenceMap).map(tableName => <li key={tableName} >{tableName}</li> );
            reference = <ul>{rows}</ul>;
        }
        console.log(this.props.entity);
        return (
            <div className="entity-tooltip-container">
                <div className="entity-tooltip">
                    <h3>{this.props.entity.name}</h3>
                    <table>
                        <tbody>
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
                </div>
            </div>
        )
    }
}

EntityStatsTooltip.propTypes = {
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