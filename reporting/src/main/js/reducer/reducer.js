/**
 * Created by Petr on 3/15/2017.
 */
import { combineReducers } from 'redux'
import entity from '../entity/entity-reducer'
import column from '../column/column-reducer'
import condition from '../condition/condition-reducer'
import menu from '../menu/menu-reducer'

export default combineReducers({
    entity,
    column,
    //condition,
    menu
});