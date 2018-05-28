
/**
 * Helper to display data
 * @param object
 * @returns normalized data
 */
export function normalizeForTableCell(object) {
    if (object === null || typeof(object) === 'undefined') {
        return 'null'
    }
    if (object === false) {
        return 'false'
    }
    if (object === true) {
        return 'true'
    }
    return object;
}
/**
 * Used to round date time to date
 * @param datetime
 * @returns {*} formatted string date
 */
export function roundDateTime(datetime) {
    let timestamp = datetime;
    if (isNaN(datetime)) {
        timestamp = Date.parse(datetime);
    }
    if (isNaN(timestamp)) {
        return null;
    }
    let date = new Date(timestamp);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
}

/**
 * Format date time
 * @param datetime
 * @returns {*} formatted datetime string
 */
export function formatDateTime(datetime) {
    let timestamp = datetime;
    if (isNaN(datetime)) {
        timestamp = Date.parse(datetime);
    }
    if (isNaN(timestamp)) {
        return null;
    }
    let date = new Date(timestamp);
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' '
        + date.getHours() + ':' + leadingZero(date.getMinutes()) + ':' + leadingZero(date.getSeconds());
}

const leadingZero = (number) => {
    return number < 10 ? ("0" + number) : number;
};
//redux reducer helpers
export function updateObject(oldObject, newValues) {
    //avoid mutating
    return Object.assign({}, oldObject, newValues);
}

export function deleteItemFromArray(array, index) {
    let a = [...array];
    a.splice(index, 1);
    return a;
}


export function updateItemInArray(array, index, updateItemCallback) {
    const updatedItems = array.map((item, i) => {
        if (i !== index) {
            return item;
        }
        // Use the provided callback to create an updated item
        const updatedItem = updateItemCallback(item);
        return updatedItem;
    });

    console.debug("items ", updatedItems);
    return updatedItems;
}
