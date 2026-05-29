export interface DemoTripHistoryItem {
  date: string;
  route: string;
  fare: number;
  rating: number;
}

/** DEMO ONLY: static trip history for prototype UI. Not authoritative trip history. */
export const demoTripHistory: DemoTripHistoryItem[] = [
  {
    date: '2024-07-21',
    route: 'BGC to Makati',
    fare: 250,
    rating: 5,
  },
  {
    date: '2024-07-21',
    route: 'Makati to Quezon City',
    fare: 450,
    rating: 5,
  },
  {
    date: '2024-07-20',
    route: 'Pasay to BGC',
    fare: 300,
    rating: 4,
  },
  {
    date: '2024-07-20',
    route: 'Quezon City to Marikina',
    fare: 350,
    rating: 5,
  },
  {
    date: '2024-07-19',
    route: 'Taguig to Pasig',
    fare: 220,
    rating: 5,
  },
];
