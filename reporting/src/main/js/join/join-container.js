import {connect} from 'react-redux';
import JoinSection from './join-section';
import {saveJoinEdit, openJoinEdit, closeJoinEdit, selectJoinPath, selectJoinStart} from './join-actions';
/**
 * Join container
 *
 * Created by Petr on 4/5/2017.
 */
const mapStateToProps = (state) => {
    return {
        parameters: state.join.parameters,
        editParameters: state.join.editParameters,
        joinedEntities: state.join.joinedEntities,
        editIndex: state.join.editIndex,
        confirmOnly: state.join.confirmOnly,
        loading: state.join.loading,
        error: state.join.error
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        saveJoinEdit: (index, parameters) => {
            dispatch(saveJoinEdit(index, parameters))
        },
        openJoinEdit: (index) => {
            dispatch(openJoinEdit(index))
        },
        closeJoinEdit: () => {
            dispatch(closeJoinEdit())
        },
        selectJoinPath: (selectedPath) => {
            dispatch(selectJoinPath(selectedPath))
        },
        selectJoinStart: (joinStart) => {
            dispatch(selectJoinStart(joinStart))
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JoinSection);