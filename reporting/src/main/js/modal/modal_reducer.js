import {MODAL_OPEN, MODAL_CLOSE} from './modal-actions'
import {updateObject} from '../utils/utils'
import typeToReducer from 'type-to-reducer'
/**
 * Modal window reducer
 *
 * Created by Petr on 3/8/2017.
 */
const initialState = {
    opened: false,
    confirm: null,
    decline: null,
    message: null,
    type: null
};
export default typeToReducer({
    [MODAL_OPEN]: (state, action) => (
        updateObject(state, {
            opened: true,
            confirm: action.payload.confirm,
            decline: action.payload.decline,
            message: action.payload.message,
            type: action.payload.type
        })
    ),
    [MODAL_CLOSE]: (state, action) => (
        updateObject(state, {
            opened: false,
            confirm: null,
            decline: null,
            message: null,
            type: null
        })
    )
}, initialState);