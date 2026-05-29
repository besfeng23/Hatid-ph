export interface DemoDriver {
  name: string;
  rating: number;
  vehicle: string;
  plate: string;
  avatarUrl: string;
  avatarHint: string;
}

/** NOT PRODUCTION DISPATCH: static driver for prototype UI only. */
export const demoDriver: DemoDriver = {
  name: 'John',
  rating: 4.9,
  vehicle: 'Toyota Vios',
  plate: 'ABC-1234',
  avatarUrl:
    'https://images.unsplash.com/photo-1624395213043-fa2e123b2656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxtYW4lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjQ5NzY5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  avatarHint: 'man portrait',
};
