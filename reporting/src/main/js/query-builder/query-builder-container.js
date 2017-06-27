import { connect } from 'react-redux';
import QueryBuilder from './query-builder';
import {closeModal} from '../modal/modal-actions'

const mapStateToProps = (state) =>{
    console.log("modal map", state.modal);
    return {
        modal: {
            confirm: state.modal.confirm,
            decline: state.modal.decline,
            message: state.modal.message,
            type: state.modal.type
        },
        modalOpened: state.modal.opened
    }
};
const mapDispatchToProps = (dispatch) =>{
    return {
        dispatch: (action) => {
            if (action) {
                dispatch(action);
            }
            //close after action
            dispatch(closeModal());
        }
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QueryBuilder);