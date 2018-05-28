import React from 'react'
/**
 * Tooltip component to show property statistics and information
 *
 * Created by Petr on 3/19/2017.
 */
export default class PropertyStatsTooltip extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
    }

    render() {

        const {
            property
        } = this.props;
        let notNull = null;
        if (property.notNull) {
            notNull = "Not Null";
        }
        let enumConstraints = null;
        if (property.enumConstraints) {
            let values = property.enumConstraints.map((value, i) => <li key={i}>{value}</li>);
            enumConstraints = <tr>
                <td>Allowed values:</td>
                <td>
                    <ul>{values}</ul>
                </td>
            </tr>
        }
        return (
            <div className="entity-tooltip-container">
                <div className="entity-tooltip">
                    <h3>{property.name}</h3>
                    {notNull}
                    <table>
                        <tbody>
                        <tr>
                            <td>Type:</td>
                            <td>{property.dataType}</td>
                        </tr>
                        {enumConstraints}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

PropertyStatsTooltip.propTypes = {
    property: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        dataType: React.PropTypes.string.isRequired,
        enumConstraints: React.PropTypes.array
    }).isRequired,
};