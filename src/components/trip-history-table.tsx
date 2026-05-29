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
import { demoTripHistory } from '@/lib/demo/mock-trip-history';

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
        {demoTripHistory.map((trip) => (
          <TableRow key={`${trip.date}-${trip.route}`}>
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
