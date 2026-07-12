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

export function millisecondsToDays(
    value: number
): number {
    return value / 86400000
}

export function shallowClone<T>(original: T[]): T[];
export function shallowClone<T extends object>(original: T): T;
export function shallowClone(original: any) {
    if (Array.isArray(original)) {
        return [...original];
    }
    return { ...original };
}

export function ordinalSuffix(value: number | undefined): string {
    if (value == undefined) {
        return ""
    }
    const rounded = Math.round(value)

    const mod100 = rounded % 100

    if (mod100 >= 11 && mod100 <= 13) {
        return `${rounded}th`
    }

    switch (rounded % 10) {
        case 1:
            return `${rounded}st`
        case 2:
            return `${rounded}nd`
        case 3:
            return `${rounded}rd`
        default:
            return `${rounded}th`
    }
}