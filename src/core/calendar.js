export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DAYS_IN_MONTH = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function isLeap(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(month, year) {
  if (month === 2 && isLeap(year)) return 29;
  return DAYS_IN_MONTH[month];
}

export function seasonFor(month) {
  if ([6, 7, 8].includes(month)) return 'summer';
  if ([9, 10].includes(month)) return 'autumn';
  return 'early winter';
}

export function advanceDate(month, day, year = 1878) {
  let m = month;
  let d = day + 1;
  while (d > daysInMonth(m, year)) {
    d -= daysInMonth(m, year);
    m += 1;
    if (m > 12) {
      m = 1;
      year += 1;
    }
  }
  return { month: m, day: d };
}
