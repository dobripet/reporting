export const MODAL_OPEN = 'MODAL_OPEN';
export function openModal (confirm, message, type, decline) {
    return {
        type: MODAL_OPEN,
        payload: {confirm, decline, message, type}
    }
}
export const MODAL_CLOSE = 'MODAL_CLOSE';
export function closeModal () {
    return {
        type: MODAL_CLOSE,
        payload: {}
    }
}

//util, modal types
export const TYPE_CONFIRM = "TYPE_CONFIRM";
export const TYPE_ERROR = "TYPE_ERROR";
export const TYPE_INFO = "TYPE_INFO";