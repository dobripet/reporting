/**
 * Created by Petr on 3/15/2017.
 */
import { combineReducers } from 'redux'
import entity from '../entity/entity-reducer'
import column from '../column/column-reducer'
import query from '../query/query-reducer'
import preview from '../preview/preview-reducer'
import join from '../join/join-reducer'
import modal from '../modal/modal_reducer'
import menu from '../menu/menu-reducer'

export default combineReducers({
    entity,
    column,
    query,
    preview,
    join,
    modal,
    menu
});