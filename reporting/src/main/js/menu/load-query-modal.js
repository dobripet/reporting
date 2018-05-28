import React from 'react'
import Loader from '../utils/custom-loader'
import {formatDateTime} from '../utils/utils';
/**
 * Load query window component
 *
 * Created by Petr on 4/5/2017.
 */
export default class LoadQueryModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.props.onClose();
    }

    handleChoose(id) {
        this.props.loadQuery(id);
        this.props.onClose();
    }

    render() {
        let queries = "No saved queries found.";
        if (this.props.queries.length > 0) {
            queries = this.props.queries.map((query) => <tr key={query.id}
                                                            onClick={this.handleChoose.bind(this, query.id)}
                                                            className="cursor-pointer">
                <td>{query.queryName}</td>
                <td>{formatDateTime(query.updatedDate)}</td>
            </tr>)
            queries = <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Last time updated</th>
                </tr>
                </thead>
                <tbody>{queries}</tbody>
            </table>
        }
        return (
            <div className="custom-modal-container">
                <div className="custom-modal">
                    <Loader show={false}>
                        <h3>Saved queries</h3>
                        {queries}
                        <button onClick={this.handleClose} className="brn btn-primary btn-sm"
                                style={{display: "block"}}>Close
                        </button>
                    </Loader>
                </div>
            </div>
        )
    }
}

LoadQueryModal.propTypes = {
    queries: React.PropTypes.array,
    loadQuery: React.PropTypes.func.isRequired
};