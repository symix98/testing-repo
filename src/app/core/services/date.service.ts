import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DateService {

  constructor() { }

  //Convert Date
  convertDate(Date) {
    return moment(Date).format("MMM DD YYYY");
  }

  //Convert Datetime
  convertDatetime(Date) {
    return moment(Date).format("MMM DD, YYYY HH:mm A");
  }

  //System Date Format
  systemDateFormat(Date) {
    return moment(Date).format('YYYY-MM-DD');
  }

  //UTC Date Format
  UTC(Date) {
    return moment.utc(Date).format();
  }

  //Jump months forward or backward from given date
  appendMonths(date, month) {
    return moment(date).add(month, 'M').format("YYYY-MM-DD");
  }

  //Jump days forward or backward from given date
  appendDays(date, days: number) {
    return moment(date, "YYYY-MM-DD").add(days, 'days').format("YYYY-MM-DD");
  }

  // Compare Date with current date
  isDateAfter(date): boolean {
    return moment().isAfter(date);
  }

  // Get difference between today and input date in days
  compareCurrentDate(date): number {
    return moment(date).diff(moment(), 'days');
  }

  // Compare two dates
  compareDates(date1, date2) {
    return moment(date1).diff(date2, 'days');
  }

  // get how long ago a record was created
  dateAgo(d: Date) {
    let isDateSame = moment(d).isSame(moment(), 'day');
    // let isDateWithinOneWeek = moment(d).isSameOrAfter(moment().day(-7).format('YYYY-MM-DD'), 'day') && moment(d).isBefore(moment(), 'day')
    //let isDateEarlier = moment(d).isBefore(moment().day(-7).format('YYYY-MM-DD'), 'day');
    let isDateYesterday = moment(d).isSame(moment().subtract(1, "days"), "day");
    let isDateTwoDaysAgo = moment(d).isSame(moment().subtract(2, "days"), "day");
    let isDateEarlier = moment(d).isBefore(moment().subtract(2, "days").format('YYYY-MM-DD'), 'day');

    if (isDateSame) {
      return 'Today';
    }
    else if (isDateYesterday) {
      return 'Yesterday';
    }
    else if (isDateTwoDaysAgo) {
      return 'Two Days Ago';
    }
    /*else if (isDateWithinOneWeek) {
      return 'One Week Ago';
    }*/
    else if (isDateEarlier) {
      return 'Earlier';
    }
  }

  extractTimeFromDate(Date) {
    return moment(Date).format("hh:mm a");
  }

  timeFromNow(Date) {
    return moment(Date).fromNow();
  }

  startOfMonth(date) {
    return moment(date).startOf('month');
  }

  endOfMonth(date) {
    return moment(date).endOf('month');
  }

  calculateDuration(startDate, endDate) {
    var now = moment(startDate);
    var end = moment(endDate);
    var duration = moment.duration(end.diff(now));
    var months = duration.asMonths();

    if (months < 1) {
      var weeks = duration.asWeeks();
      if (weeks < 1) {
        return duration.asDays().toFixed(0) + ' Day/s';
      }
      else {
        return duration.asWeeks().toFixed(0) + ' Week/s';
      }
    }
    else {
      return duration.asMonths().toFixed(0) + ' Month/s';
    }
  }

  subtractDays(numberOfDaysToSubtract?: number) {
    let result = [];
    //calculate fromDate - it will depend on the number of days to subtract
    if (numberOfDaysToSubtract) {
      result.push(new Date(moment().subtract(numberOfDaysToSubtract, "days").format('YYYY-MM-DD')).toISOString());
    }
    else {
      result.push(new Date(moment().format('YYYY-MM-DD')).toISOString());
    }
    //toDate will be the same for all since it depends on the current day
    result.push(new Date(moment().format('YYYY-MM-DD 23:59:59')).toISOString());

    // fromDate,toDate returned in an array in this order
    return result;
  }

  startOfYear(date, format) {
    return moment(date).startOf('year').format(format);
  }

  endOfYear(date, format) {
    return moment(date).endOf('year').format(format);
  }

  //System Date Format
  dateFormatDayMonthYear(Date) {
    return moment(Date).format('DD/MM/YYYY');
  }


  //System Date Format
  dateTimeFormat(Date) {
    return moment(Date).format('YYYY-MM-DD hh:mm:ss A');
  }

  addDays(date, days: number) {
    const newDate = moment(date).add(days, 'days');
    return this.systemDateFormat(newDate);
  }

  addMonths(date, months: number) {
    const newDate = moment(date).add(months, 'months');
    return this.systemDateFormat(newDate);
  }

  dayNamefromDate(date) {
    var dt = moment(date, "YYYY-MMM-D");
    return dt.format('dd').toUpperCase();
  }

  daysDifference(day1, day2) {
    let a = moment(day1);
    let b = moment(day2);
    return b.diff(a, 'days');
  }

  daysInMonth(month, year): number {
    return moment(`${year}-${month}`, "YYYY-MMM").daysInMonth();
  }

  firstDayOfMonth(date): string {
    return moment(date).clone().startOf('month').format('dd').toUpperCase();
  }

  getDateTime(date): string {
    return moment(date).format();
  }

  getMonths(): string[] {
    return moment.monthsShort();
  }

  getDayName(date): string {
    return moment(date).format("dd").toUpperCase();
  }

  getMonthName(date): string {
    return moment(date).format('MMMM');
  }

  getMonthNumber(date): string {
    return moment(date).format("MM");
  }

  getShortMonth(date): string {
    return moment(date).format("MMM");
  }

  getYear(date): string {
    return moment(date).format('YYYY');
  }

  lastDayOfMonth(date): string {
    return moment(date).clone().endOf('month').format('dd').toUpperCase();
  }

  readDate(Date) {
    return moment(Date).format("DD/MM/YYYY");
  }
}
