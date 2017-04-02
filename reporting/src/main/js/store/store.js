/**
 * Created by Petr on 3/6/2017.
 */
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import createPromise from 'redux-promise-middleware'
import reducer from '../reducer/reducer'
/*
const isPromise = (value) => {
    if (value !== null && typeof value === 'object') {
        return value && typeof value.then === 'function';
    }
    return false;
};
const customErrorMiddleware = store => next => action => {
        // If not a promise, continue on
    console.log('loguj', action.payload);
        if (!isPromise(action.payload)) {
            console.log('ajaja');
            return next(action);
        }
        return next(action).catch(error => {
            console.log(`${action.type} caught at middleware with reason: ${JSON.stringify(error.message)}.`);
            return error;
        });
};*/
const middleware = applyMiddleware(
    //thunk,
    //customErrorMiddleware,
    createPromise(),
    createLogger()
);

export default createStore(
        reducer,
        middleware
    );


