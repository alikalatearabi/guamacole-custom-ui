export const unixToUTC = (unix: string) => {
    if (unix) {
        const date = new Date(unix)
        return date.toUTCString()
    } else return '----'
}

export const strToDate = (dateString: string) => {
    const timeString = dateString;
    const currentDate = new Date();
    const timeParts = timeString?.split(":");
    if (timeParts) {
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);
        currentDate.setHours(hours);
        currentDate.setMinutes(minutes);
        currentDate.setSeconds(seconds);
        return currentDate
    }
}