import { FormatDateType } from "./types"

export interface IHelper {
    init(type: string): void,
    scrollTo(id: string): void,
    scrollToTop(): void,
    addClass(id: string, cn: string): void,
    removeClass(id: string, cn: string): void,
    splitQueries(query: any, key: string): any,
    navOnScroll(data: { id: string, cn: string, limit?: number }): void,
    decodeBase64(data: string): { width: string, height: string, image: any },
    isEmpty(data: any, type: 'object' | 'array'): boolean,
    capitalize(val: string): string,
    sort(data: Array<any>): Array<any>,
    days(): Array<{ id: number, name: string, label: string }>
    months(): Array<{ id: number, name: string, label: string }>,
    random(size: number, isAlpha?: boolean): string,
    formatDate(date: any, type: FormatDateType): string,
    equalLength(id: string, childId: string, len?: number): void,
    setWidth(id: string, val: number): void,
    setHeight(id: string, val: number): void,
    isNAN(val: any): boolean,
    reposition(data: Array<any>, from: number, to: number): Array<any>,
    prioritize(data: Array<any>, prio: Array<any>, key?: string): Array<any>
    splitByComma(data: string): Array<string>
    dateToday(date: string | Date): IDateToday,
    roundFloat(val: number): number,
    addElipsis(val: string, size: number): string,
    formatPhone(val: string, code: string): string,
    leadingZero(val: number): string,
    encodeCardNumber(num: string): string,
    monthsOfYear(val: string | number): string,
    readCountries(): Array<any>,
    listCountries(): Array<{ code: string, name: string, phone: string }>
    sortData(data: Array<any>, filter: string): Array<any>,
    attachPhoneCode(code: string, phone: string, include: boolean): string,
    capitalizeWord(value: string): string,
    shrinkWordInString(value: string, ret: number): string,
    truncateText(text: string, max: number): string
    objectToArray(data: Object | any): Array<any>,
    displayBalance(value: number): string,
    parseInputNumber(value: string, type: 'number' | 'decimal'): number,
    toDecimal(value: number, places: number): number
    formatCurrency(currency: string): string,
    currentDate(): Date,
    getCurrentPage(data: IPagination): number;
    getInitials(value: string): string,
    hyphenate(action: 'add' | 'remove', val: string): string,
    daysFromDates(start: string, end: string): number,
    getCountry(code: string): ICountry | null,
    getAvatar(select: string | number): string,
    enumToArray(data: Object, type: 'all' | 'values-only' | 'keys-only'): Array<any>,
    extractor(data: any): any
    strengthColors: string[]
}


export interface IState {
    code: string,
    name: string,
    subdivision: string
}


export interface IDateToday {
    year: string,
    month: string,
    date: string,
    hour: string,
    minutes: string,
    seconds: string,
    ISO: string,
    dateTime: string | number
}

export interface ITimezone {
    name: string,
    label: string,
    displayName: string,
    countries: Array<string>,
    utcOffset: string,
    utcOffsetStr: string,
    dstOffset: string,
    dstOffsetStr: string,
    aliasOf: string
}

export interface ICountry {
    name: string
    code2: string,
    code3: string,
    capital: string,
    region: string,
    subregion: string,
    states: Array<IState>,
    slug: string,
    timezones: Array<ITimezone>
    flag: string,
    base64: string,
    currencyCode: string,
    currencyImage: string,
    phoneCode: string

}

export interface IPagination {
    next: { page: number, limit: number },
    prev: { page: number, limit: number },
}
