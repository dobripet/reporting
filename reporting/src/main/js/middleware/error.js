const isPromise = (value) =>{
    if (value !== null && typeof value === 'object') {
        console.log("Asd");
        return value && typeof value.then === 'function';
    }
    return false;
};

export default function errorMiddleware(){
    return next => action => {
        // If not a promise, continue on
        console.log("action ", action);
        console.log("jedu " + action.payload.then);
        if (!isPromise(action.payload)) {
            console.log("nitpromise");
            return next(action);
        }
        return next(action).catch(error =>{
            //  error.then(result => console.log("resuult", result));
            console.log("Error middleware: Promise error: " + error);
            return error;
        })
    }
}
