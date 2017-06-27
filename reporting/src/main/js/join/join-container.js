import { connect } from 'react-redux';
import JoinSection from './join-section';
import { saveJoinEdit, openJoinEdit, closeJoinEdit, selectJoinPath } from './join-actions';

const mapStateToProps = (state) =>{
    return {
        parameters: state.join.parameters,
        editParameters: state.join.editParameters,
        editIndex: state.join.editIndex,
        confirmOnly: state.join.confirmOnly,
        loading:  state.join.loading,
        error:  state.join.error
    }
};
const mapDispatchToProps = (dispatch) =>{
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
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JoinSection);