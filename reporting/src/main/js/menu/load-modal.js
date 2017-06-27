import React from 'react'
import Loader from '../utils/custom-loader'
import {formatDateTime} from '../utils/utils';
export default class LoadModal extends React.Component {
    constructor(props) {
        super(props);
        //initial state
        // bindings
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        //this.searchInput.focus();
        console.log("fetch dobrty");
        //this.props.getEntityPropertyStats(this.props.property.name);
        //this.props.loadAllQueries();
    }
    handleClose(){
        this.props.onClose();
    }
    handleChoose(id){
        this.props.loadQuery(id);
        this.props.onClose();
    }
    render(){
        let queries = "No saved queries found.";
        if(this.props.queries.length > 0){
            queries = this.props.queries.map((query) => <tr key={query.id} onClick={this.handleChoose.bind(this, query.id)}><td>{query.queryName}</td><td>{formatDateTime(query.updatedDate)}</td></tr>)
            queries = <table>
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
                    <Loader show={false} >
                        <h3>Saved queries</h3>
                        {queries}
                        <button onClick={this.handleClose}>Close</button>
                    </Loader>
                </div>
            </div>
        )
    }
}

LoadModal.propTypes = {
    //loadAllQueries: React.PropTypes.func.isRequired
    queries: React.PropTypes.array,
    loadQuery: React.PropTypes.func.isRequired
};