
'use client';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from './ui/card';
import { useState, useEffect } from 'react';

const generateData = () => [
  { name: 'Mon', total: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Tue', total: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Wed', total: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Thu', total: Math.floor(Math.random() * 2000) + 1000 },
  { name: 'Fri', total: Math.floor(Math.random() * 3000) + 1500 },
  { name: 'Sat', total: Math.floor(Math.random() * 4000) + 2000 },
  { name: 'Sun', total: Math.floor(Math.random() * 4000) + 2000 },
];


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="p-4 bg-background/80 backdrop-blur-sm">
        <p className="label font-bold text-primary">{`${label}`}</p>
        <p className="intro text-foreground">{`Earnings: ₱${payload[0].value.toLocaleString()}`}</p>
      </Card>
    );
  }

  return null;
};

export function EarningsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(generateData());
  }, []);

  if (!data.length) {
    return null; // Or a loading indicator
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => `₱${value / 1000}k`}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
          content={<CustomTooltip />}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
