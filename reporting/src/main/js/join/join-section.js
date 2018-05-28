import React from 'react'
import JoinParameters from './join-parameters'
import JoinModal from './join-modal'
import {getParametersEnd, getParametersStart} from '../utils/join-utils'

/**
 * Join section component
 *
 * Created by Petr on 4/5/2017.
 */
export default class JoinSection extends React.Component {
    constructor(props) {
        super(props);
        // bindings
        this.handleShowEdit = this.handleShowEdit.bind(this);
        this.handleCloseEdit = this.handleCloseEdit.bind(this);
        this.handleSaveEdit = this.handleSaveEdit.bind(this);
        this.browseChildren = this.browseChildren.bind(this);
    }

    handleShowEdit(index) {
        this.props.openJoinEdit(index);
    }

    handleCloseEdit() {
        this.props.closeJoinEdit();
    }

    handleSaveEdit(index, parameters) {
        this.props.saveJoinEdit(index, parameters);
    }

    browseChildren(parameters, index, offset, params) {
        //pixel offset for visualization
        params.push(<JoinParameters key={index} index={index} offset={offset} joinParameters={parameters[index]}
                                    showEdit={this.handleShowEdit}/>);
        offset += 30;
        parameters.forEach((p, i) => {
            if (getParametersEnd(parameters[index]) === getParametersStart(p)) {
                this.browseChildren(parameters, i, offset, params);
            }
        });
    }

    render() {
        const {
            parameters,
            loading,
            confirmOnly,
            editIndex,
            editParameters
        } = this.props;
        let params = "No joined entities.";
        //create tree from parameters
        if (Array.isArray(parameters) && parameters.length > 0) {
            params = [];
            parameters.forEach((p, i) => {
                let parent = null;
                for (let y = 0; y < parameters.length; y++) {
                    if (getParametersStart(p) === getParametersEnd(parameters[y])) {
                        parent = y;
                    }
                }
                //root, browse recursively
                if (parent === null) {
                    //params.push(<JoinParameters key={i} index={i} offset={0} joinParameters={p} showEdit={this.handleShowEdit}/>);
                    let offset = 0;
                    this.browseChildren(parameters, i, offset, params);
                }
            })
        }
        let editModal = null;
        //check if state wants edit
        if (editParameters) {
            editModal = <JoinModal
                joinParameters={editParameters}
                index={editIndex}
                confirmOnly={confirmOnly}
                onClose={this.handleCloseEdit}
                onSave={this.handleSaveEdit}
                onSelectPath={this.props.selectJoinPath}
                onSelectJoinStart={this.props.selectJoinStart}
            />;
        }
        return (
            <div className="join-section">
                {params}
                {editModal}
            </div>

        );
    }
}
JoinSection.PropTypes = {
    parameters: React.PropTypes.array.isRequired,
    editParameters: React.PropTypes.object,
    editIndex: React.PropTypes.number,
    confirmOnly: React.PropTypes.bool
};