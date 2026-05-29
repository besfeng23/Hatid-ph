export interface DemoRideOption {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  eta: string;
}

/** DEMO ONLY: static ride options for prototype UI. Not production pricing. */
export const demoRideOptions: DemoRideOption[] = [
  {
    id: 'hatid-car',
    name: 'HatidCar',
    description: 'Affordable everyday rides',
    capacity: 4,
    price: 250,
    eta: '5 min',
  },
  {
    id: 'hatid-moto',
    name: 'HatidMoto',
    description: 'Fast motorcycle delivery-style demo option',
    capacity: 1,
    price: 120,
    eta: '3 min',
  },
  {
    id: 'hatid-plus',
    name: 'HatidPlus',
    description: 'Larger vehicle demo option',
    capacity: 6,
    price: 420,
    eta: '8 min',
  },
  {
    id: 'hatid-padala',
    name: 'HatidPadala',
    description: 'Package delivery demo option',
    capacity: 0,
    price: 180,
    eta: '7 min',
  },
];
