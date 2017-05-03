import React from 'react'
export default class PropertyStatsTooltip extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
    }

    componentDidMount() {
        //this.searchInput.focus();
        console.log("testing fetch");
        //this.props.getEntityRowCount(this.props.entityName);
    }
    render(){
        // od referred by list
        /*let referred = "No tables found.";
        if(this.props.entity.referredByMap && Object.keys(this.props.entity.referredByMap).length > 0 ){
            let rows = Object.keys(this.props.entity.referredByMap).map(tableName => <li key={tableName} >{tableName}</li> );
            referred = <ul>{rows}</ul>;
        }
        // do reference list
        let reference = "No tables found.";
        if(this.props.entity.referenceMap && Object.keys(this.props.entity.referenceMap).length > 0 ){
            let rows = Object.keys(this.props.entity.referenceMap).map(tableName => <li key={tableName} >{tableName}</li> );
            reference = <ul>{rows}</ul>;
        }*/
        console.log(this.props.entity);
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
            <div className="entity-tooltip-container">
                <div className="entity-tooltip">
                    <h3>{this.props.property.name}</h3>
                    {notNull}
                    <table>
                        <tbody>
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