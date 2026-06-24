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

export function shallowClone<T>(original: T[]): T[];
export function shallowClone<T extends object>(original: T): T;
export function shallowClone(original: any) {
    if (Array.isArray(original)) {
        return [...original];
    }
    return { ...original };
}