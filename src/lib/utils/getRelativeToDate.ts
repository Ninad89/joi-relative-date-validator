import moment from "moment";

const TODAY = 'today'

function getRelativeToDate(relativeTo: string | Date) {
    if (typeof relativeTo === 'string' && relativeTo.toLocaleLowerCase() === TODAY) {
        return moment();
    } else {
        return moment(relativeTo);
    }
}

export default getRelativeToDate;