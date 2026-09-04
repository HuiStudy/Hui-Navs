declare module 'lunar-javascript' {
  export class Lunar {
    getYear(): number
    getMonth(): number
    getDay(): number
    getYearInGanZhi(): string
    getMonthInChinese(): string
    getDayInChinese(): string
    getWeekInChinese(): string
    getYearShengXiao(): string
    getJieQi(): string
    isLeap(): boolean
    getYearInGan(): string
    getYearInZhi(): string
    toString(): string
    toFullString(): string
  }
  export class Solar {
    static fromDate(date: Date): Solar
    static fromYmd(year: number, month: number, day: number): Solar
    getYear(): number
    getMonth(): number
    getDay(): number
    getLunar(): Lunar
  }
}
