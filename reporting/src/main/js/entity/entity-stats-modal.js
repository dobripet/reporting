import React from 'react'
import EntityStatsModalKey from './entity-stats-modal-key'

/**
 * Statistics and information modal window component for entity
 *
 * Created by Petr on 3/19/2017.
 */
export default class EntityStatsModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.props.getEntityRowCount(this.props.entity.name);
    }

    handleClose() {
        this.props.onClose();
    }

    render() {
        const {
            referredByMap,
            referenceMap,
        } = this.props.entity;
        // do referred by list with columns
        let referred = "No tables found.";
        if (referredByMap && Object.keys(referredByMap).length > 0) {
            //map all referredBy tables
            referred = Object.keys(referredByMap).map(tableName => <EntityStatsModalKey key={tableName}
                                                                                        keys={referredByMap[tableName]}
                                                                                        name={tableName}/>);
        }

        // do reference list with columns
        let reference = "No tables found.";
        if (referenceMap && Object.keys(referenceMap).length > 0) {
            //map all referredBy tables
            reference = Object.keys(referenceMap).map(tableName => <EntityStatsModalKey key={tableName}
                                                                                        keys={referenceMap[tableName]}
                                                                                        name={tableName}/>);
        }
        //documentation links
        let schemaUrl = null;
        if (this.props.entity.schemaUrl) {
            schemaUrl = <tr>
                <td>Schema:</td>
                <td><a href={this.props.entity.schemaUrl}>{this.props.entity.schemaUrl}</a></td>
            </tr>
        }
        let tableUrl = null;
        if (this.props.entity.tableUrl) {
            tableUrl = <tr>
                <td>Table:</td>
                <td><a href={this.props.entity.tableUrl}>{this.props.entity.tableUrl}</a></td>
            </tr>
        }
        return (
            <div className="custom-modal-container">
                <div className="custom-modal">
                    <h3>{this.props.entity.name}</h3>
                    <table>
                        <tbody>
                        {tableUrl}
                        {schemaUrl}
                        <tr>
                            <td>Count:</td>
                            <td>{this.props.entity.rowCount}</td>
                        </tr>

                        </tbody>
                    </table>
                    <h4>Referred by:</h4>
                    {referred}
                    <h4>Reference:</h4>
                    {reference}
                    <br/>
                    <button onClick={this.handleClose} className="brn btn-primary btn-sm" style={{display: "block"}}>
                        Close
                    </button>
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
    getEntityRowCount: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
};