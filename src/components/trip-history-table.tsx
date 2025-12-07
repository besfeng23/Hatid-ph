
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from './ui/badge';
import { Star } from 'lucide-react';

const trips = [
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

export function TripHistoryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Route</TableHead>
          <TableHead className="text-right">Fare</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{trip.date}</TableCell>
            <TableCell>{trip.route}</TableCell>
            <TableCell className="text-right">₱{trip.fare.toFixed(2)}</TableCell>
            <TableCell className="text-right">
              <Badge variant="secondary" className="flex items-center justify-center gap-1 w-14">
                {trip.rating} <Star className="h-3 w-3 text-primary fill-primary" />
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
