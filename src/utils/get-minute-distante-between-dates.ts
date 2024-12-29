export function getDistanceInMinutesBetweenDates(dateFrom: Date, dateTo: Date) {
    const MILISECONDS_PER_MINUTE = 60000
    return (
        Math.abs(dateTo.getTime() - dateFrom.getTime()) / MILISECONDS_PER_MINUTE
    )
}
