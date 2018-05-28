import React from 'react'
import Loader from '../../utils/custom-loader'
import {BarChart, LineChart, XAxis, YAxis, CartesianGrid, Legend, Bar, Line, Tooltip} from 'recharts'
import {formatDateTime, roundDateTime} from '../../utils/utils';
/**
 * Property modal window component for showing statistics and information
 *
 * Created by Petr on 3/19/2017.
 */
export default class PropertyStatsModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.props.getEntityPropertyStats(this.props.property.name);
        if (this.props.rowCount == null) {
            this.props.getEntityRowCount(this.props.entityName);
        }
    }

    handleClose() {
        this.props.onClose();
    }

    render() {

        const {
            notNull,
            statistic,
            enumConstraints,
            dataType
        } = this.props.property;
        let notNullSpan = null;
        let nullPercentageRow = null;
        if (notNull) {
            notNullSpan = <span>Not Null</span>;
        } else {
            if (statistic) {
                nullPercentageRow = <tr>
                    <td>Null Percentage:</td>
                    <td>{statistic.nullPercentage.toFixed(2)}%</td>
                </tr>;
            }
        }
        let enumConstraintsRow = null;
        if (enumConstraints) {
            let values = enumConstraints.map(value => <li key={value}>{value}</li>);
            enumConstraintsRow = <tr>
                <td>Allowed values:</td>
                <td>
                    <ul>{values}</ul>
                </td>
            </tr>
        }
        let histogram = null;
        let rowsSampledRow = null;
        let minRow = null;
        let maxRow = null;
        let avgRow = null;
        let trueFalseRow = null;
        let updated = null;
        if (statistic) {
            if (statistic.histogram) {
                if (statistic.histogram.length < 21) {
                    let width = statistic.histogram.length * 40 + 100;
                    histogram = <BarChart width={width} height={300} data={statistic.histogram}>
                        <XAxis dataKey="name" tick={<CustomizedAxisTick dataType={dataType}/>} minTickGap={3}
                               height={100} interval={0}/>
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8"/>
                    </BarChart>
                } else {
                    let width = statistic.histogram.length * 5 + 100;
                    histogram = <LineChart width={width} height={250} data={statistic.histogram}>
                        <XAxis dataKey="name" tick={<CustomizedAxisTick dataType={dataType}/>} minTickGap={0}
                               height={100} interval={5}/>
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8"/>
                    </LineChart>
                }
            }
            if (statistic.rowsSampled) {
                rowsSampledRow = <tr>
                    <td>Rows Sampled:</td>
                    <td>{statistic.rowsSampled}</td>
                </tr>;
            }
            //checks because 0 or false are possible
            if (typeof(statistic.min) != 'undefined' && statistic.min != null) {
                let min = statistic.min;
                if (dataType === 'datetime') {
                    min = formatDateTime(min);
                }
                minRow = <tr>
                    <td>Minimal value:</td>
                    <td>{min}</td>
                </tr>;
            }
            if (typeof(statistic.max) != 'undefined' && statistic.max != null) {
                let max = statistic.max;
                if (dataType === 'datetime') {
                    max = formatDateTime(max);
                }
                maxRow = <tr>
                    <td>Maximal value:</td>
                    <td>{max}</td>
                </tr>;
            }
            if (typeof(statistic.avg) != 'undefined' && statistic.avg != null) {
                let avg = statistic.avg;
                if (dataType === 'datetime') {
                    avg = formatDateTime(avg);
                }
                avgRow = <tr>
                    <td>Average value:</td>
                    <td>{avg}</td>
                </tr>;
            }
            if (typeof(statistic.truePercentage) != 'undefined' && statistic.truePercentage != null) {
                trueFalseRow = <tr>
                    <td>True - false:</td>
                    <td>{statistic.truePercentage}% - {statistic.falsePercentage}%</td>
                </tr>;
            }
            if (statistic.updated) {
                let formattedUpdate = formatDateTime(statistic.updated);
                if (formattedUpdate) {
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
                    <Loader show={this.props.loading > 0} hideContentOnLoad={false}>
                        <table>
                            <tbody>
                            <tr>
                                <td>Type:</td>
                                <td>{dataType}</td>
                            </tr>
                            <tr>
                                <td>Count:</td>
                                <td>{this.props.rowCount}</td>
                            </tr>
                            {updated}
                            {rowsSampledRow}
                            {nullPercentageRow}
                            {enumConstraintsRow}
                            {minRow}
                            {maxRow}
                            {avgRow}
                            {trueFalseRow}

                            </tbody>
                        </table>
                        {histogram}
                    </Loader>
                    <button onClick={this.handleClose} className="brn btn-primary btn-sm" style={{display: "block"}}>
                        Close
                    </button>
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
    getEntityPropertyStats: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func.isRequired
};
/**
 * Workaround to turn axis tics labels
 */
class CustomizedAxisTick extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {x, y, stroke, payload, dataType} = this.props;
        //round datetime
        if (dataType === 'datetime') {
            payload.value = roundDateTime(payload.value);
        }
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={-5} dy={16} textAnchor="end" fill="#666" transform="rotate(-80)">{payload.value}</text>
            </g>
        );
    }
}