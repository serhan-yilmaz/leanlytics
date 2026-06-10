export function timestampToDate(
    timestamp: number
): string {
    return new Date(timestamp).toISOString().slice(0, 10)
}

export function dateToTimestamp(
    date: string
): number {
    return new Date(date).getTime()
}

