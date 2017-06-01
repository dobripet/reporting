export function formatDateTime(datetime){
    let timestamp = datetime;
    if(isNaN(datetime)) {
        timestamp = Date.parse(datetime);
    }
    if (isNaN(timestamp)){
        return null;
    }
    let date = new Date(timestamp);
    return date.getDay() + '.' + (date.getMonth()+1)+'.'+date.getFullYear()+' '
        +date.getHours()+ ':'+leadingZero(date.getMinutes())+':'+leadingZero(date.getSeconds());
}

const leadingZero = (number) =>{
    return number < 10 ? ("0"+number) : number;
}