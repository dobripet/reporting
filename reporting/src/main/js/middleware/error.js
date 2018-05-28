/**
 * Error handling middleware
 *
 * Created by Petr on 3/18/2017.
 */
const isPromise = (value) =>{
    if (value !== null && typeof value === 'object') {
        return value && typeof value.then === 'function';
    }
    return false;
};

export default function errorMiddleware(){
    return next => action => {
        // If not a promise, continue on
        if (!isPromise(action.payload)) {
            return next(action);
        }
        return next(action).catch(error =>{
            console.log("Error middleware: Promise error: " + error);
            return error;
        })
    }
}
