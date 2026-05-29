export interface DemoEarningDay {
  name: string;
  total: number;
}

/** MOCK EARNINGS: static prototype chart data. Not ledger-derived. */
export const demoEarningsByDay: DemoEarningDay[] = [
  { name: 'Mon', total: 1600 },
  { name: 'Tue', total: 2200 },
  { name: 'Wed', total: 1800 },
  { name: 'Thu', total: 2600 },
  { name: 'Fri', total: 3300 },
  { name: 'Sat', total: 4200 },
  { name: 'Sun', total: 3900 },
];
