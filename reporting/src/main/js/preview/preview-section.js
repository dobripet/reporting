import React from 'react'
import {normalizeForTableCell} from '../utils/utils'
/**
 * Data preview section component
 *
 * Created by Petr on 3/4/2017.
 */
export default class PreviewSection extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        const{
            data,
            columnNames
        } = this.props;

        let header = columnNames.map((name, i) => <th key={i}>{name}</th>);
        let rows = null;
        if(data) {
            rows = data.map((row, i) => {
                if (Array.isArray(row)) {
                    let columns = row.map((column, j) => <td key={j}>{normalizeForTableCell(column)}</td>);
                    return <tr key={i}>{columns}</tr>;
                } else {
                    return <tr key={i}>
                        <td>{normalizeForTableCell(row)}</td>
                    </tr>
                }
            });
        }
        return (
            <div className="preview-section">
                    <table className="table-bordered">
                        <caption>Preview</caption>
                        <thead>
                            <tr>
                                {header}
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
            </div>

        );
    }
}
PreviewSection.PropTypes={
    data: React.PropTypes.array.isRequired
};