/*import configureStore from 'redux-mock-store'
import {middleware} from '../store/store'
import {addPropertiesToColumnList} from '../column/column-actions'
import {initState} from './storeMock'


const mockStore = configureStore(middleware);

it('Add property to column list', () => {
    //const initialState = {};
    const store = mockStore(initState);

    // Dispatch the action
    store.dispatch(addPropertiesToColumnList(initState.entity.entities['Warehouse_Packages'], [{"name":"Create_Date","columnType":"datetime","dataType":"datetime","statisticName":"_WA_Sys_00000044_4067D70B","notNull":false,"enumConstraints":null}]), );

    // Test if your store dispatched the expected actions
    const newState = store.getState()
    const expectedState = { type: 'ADD_TODO' }
    expect(actions).toEqual([expectedPayload])
});*/