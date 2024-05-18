import moment from "jalali-moment";

const DATE_FORMAT = 'YYYY/MM/DD'

export function ToFaDate(date: string | Date, format: string = DATE_FORMAT) {
    return moment(date).locale('fa').format(format).toString();
}