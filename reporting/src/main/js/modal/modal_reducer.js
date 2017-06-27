import { MODAL_OPEN, MODAL_CLOSE } from './modal-actions'
import { updateObject } from '../utils/utils'
import typeToReducer from 'type-to-reducer'
const initialState = {
    opened: false,
    confirm: null,
    decline: null,
    message: null,
    type: null
};
export default typeToReducer({
    [MODAL_OPEN]:(state, action) => (
        updateObject(state, {
            opened: true,
            confirm: action.payload.confirm,
            decline: action.payload.decline,
            message: action.payload.message,
            type: action.payload.type
        })
    ),
    [MODAL_CLOSE]:(state, action) => (
        updateObject(state, {
            opened: false,
            confirm: null,
            decline: null,
            message: null,
            type: null
        })
    )
}, initialState);