import React from 'react'
/**
 * Join parameter component
 * Represent single join between two entities, contains path between them
 *
 * Created by Petr on 4/5/2017.
 */
export default class JoinParameters extends React.Component {
    constructor(props) {
        super(props);
        // bindings
        this.showEdit = this.showEdit.bind(this);
    }

    showEdit() {
        this.props.showEdit(this.props.index);
    }

    render() {
        const {
            selectedPath
        } = this.props.joinParameters;
        let start = null;
        let end = null;
        if (selectedPath.length > 1) {
            start = selectedPath[0];
            end = selectedPath[selectedPath.length - 1];
        }
        return (
            <div style={{marginLeft: this.props.offset, padding: "2px"}}>
                {start} &lt;= {end} <button onClick={this.showEdit} className="btn btn-primary btn-xs">Edit</button>
            </div>
        );
    }
}
JoinParameters.propTypes = {
    showEdit: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    joinParameters: React.PropTypes.shape({
        selectedPath: React.PropTypes.array.isRequired,
        joinKeys: React.PropTypes.array.isRequired
    }).isRequired,
    offset: React.PropTypes.number.isRequired
};