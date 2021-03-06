import React from 'react'

/**
 * Tooltip component to show entity information and statistics
 *
 * Created by Petr on 3/19/2017.
 */
export default class EntityStatsTooltip extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
    }

    componentDidMount() {
        if (this.props.entity.rowCount == null) {
            this.props.getEntityRowCount(this.props.entity.name);
        }
    }

    render() {
        const {
            entity
        } = this.props;
        // referred by list
        let referred = "No tables found.";
        let keys = Object.keys(entity.referredByMap);
        if (entity.referredByMap && keys.length > 0) {
            let rows = [];
            //mapping with max length 3
            for (let i = 0; i < keys.length; i++) {
                if (i == 3) {
                    rows.push(<li key="...">...</li>);
                    break;
                }
                rows.push(<li key={keys[i]}>{keys[i]}</li>);
            }
            referred = <ul>{rows}</ul>;
        }
        // reference list
        let reference = "No tables found.";
        if (entity.referenceMap && (keys = Object.keys(entity.referenceMap)).length > 0) {
            let rows = [];
            //mapping with max length 3
            for (let i = 0; i < keys.length; i++) {
                if (i == 3) {
                    rows.push(<li key="...">...</li>);
                    break;
                }
                rows.push(<li key={keys[i]}>{keys[i]}</li>);
            }
            reference = <ul>{rows}</ul>;
        }
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