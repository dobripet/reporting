/**
 * Store definition
 *
 * Created by Petr on 3/15/2017.
 */

import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createPromise from 'redux-promise-middleware'
import reducer from '../reducer/reducer'
import errorMiddleware from '../middleware/error'

export const middleware = applyMiddleware(
    thunk,
    errorMiddleware,
    createPromise(),
    createLogger()
);
export default createStore(
    reducer,
    middleware
);


