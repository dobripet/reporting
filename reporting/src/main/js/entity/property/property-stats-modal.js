import React from 'react'
import {BarChart, LineChart, XAxis, YAxis,CartesianGrid, Legend, Bar, Line, Tooltip } from 'recharts'
import {formatDateTime} from '../../utils/utils';
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
        const {
            notNull,
            statistic,
            enumConstraints,
            dataType
        } = this.props.property;
        console.log("co se deje", this.props.property);
        let notNullSpan = null;
        let nullPercentageRow = null;
        if(notNull){
            notNullSpan = <span>Not Null</span>;
        }else {
            if(statistic) {
                nullPercentageRow = <tr>
                    <td>Null Percentage:</td>
                    <td>{statistic.nullPercentage}%</td>
                </tr>;
            }
        }
        let enumConstraintsRow = null;
        if(enumConstraints){
            let values = enumConstraints.map(value => <li key={value}>{value}</li>);
            enumConstraintsRow = <tr>
                    <td>Allowed values: </td>
                    <td><ul>{values}</ul></td>
                </tr>
        }
        let histogram = null;
        let rowsSampledRow = null;
        let minRow = null;
        let maxRow = null;
        let avgRow = null;
        let trueFalseRow = null;
        let updated = null;
        if(statistic) {
            if (statistic.histogram) {
                /*let values = statistic.histogram.map(record => <span
                    key={record.interval}> {record.interval} {record.value}</span>);*/
                if(statistic.histogram.length < 20) {
                    let width = statistic.histogram.length * 40 +100;
                    histogram = <BarChart width={width} height={250} data={statistic.histogram}>
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3"/>
                        /*<Tooltip />
                         <Legend />*/
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                } else{
                    let width = statistic.histogram.length * 5 +100;
                    histogram = <LineChart width={width} height={250} data={statistic.histogram}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                       /* <Tooltip />
                        <Legend />*/
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                }
            }
            console.log(statistic);
            if(statistic.rowsSampled) {
                rowsSampledRow = <tr>
                    <td>Rows Sampled:</td>
                    <td>{statistic.rowsSampled}</td>
                </tr>;
            }
            //checks because 0 or false are possible
            if(typeof(statistic.min) != 'undefined' && statistic.min != null) {
                let min = statistic.min;
                if(dataType === 'datetime'){
                    min = formatDateTime(min);
                    console.log(min);
                }
                minRow = <tr>
                    <td>Minimal value:</td>
                    <td>{min}</td>
                </tr>;
            }
            if(typeof(statistic.max) != 'undefined' && statistic.max != null) {
                let max= statistic.max;
                if(dataType === 'datetime'){
                    max = formatDateTime(max);
                    console.log(max);
                }
                maxRow = <tr>
                    <td>Maximal value:</td>
                    <td>{max}</td>
                </tr>;
            }
            if(typeof(statistic.avg) != 'undefined' && statistic.avg != null) {
                let avg = statistic.avg;
                if(dataType === 'datetime'){
                    avg = formatDateTime(avg);
                    console.log(avg);
                }
                avgRow = <tr>
                    <td>Average value:</td>
                    <td>{avg}</td>
                </tr>;
            }
            if(typeof(statistic.truePercentage) != 'undefined' && statistic.truePercentage != null) {
                trueFalseRow = <tr>
                    <td>True - false:</td>
                    <td>{statistic.truePercentage}% - {statistic.falsePercentage}%</td>
                </tr>;
            }
            if(statistic.updated){
                console.log()
                let formattedUpdate = formatDateTime(statistic.updated);
                console.log("UPD ", statistic.updated, formattedUpdate);
                if(formattedUpdate) {
                    updated = <tr>
                        <td>Last time updated:</td>
                        <td>{formatDateTime(statistic.updated)}</td>
                    </tr>;
                }
            }
        }
        return (
            <div className="custom-modal-container">
                <div className="custom-modal">
                    <h3>{this.props.property.name}</h3>
                    {notNullSpan}
                    <table>
                        <tbody>
                        <tr>
                            <td>Type:</td>
                            <td>{dataType}</td>
                        </tr>
                        {updated}
                        {rowsSampledRow}
                        {nullPercentageRow}
                        {enumConstraintsRow}
                        {minRow}
                        {maxRow}
                        {avgRow}
                        {trueFalseRow}
                        <tr>
                            <td>Tags:</td>
                            <td>TODO</td>
                        </tr>
                        </tbody>
                    </table>
                    {histogram}
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