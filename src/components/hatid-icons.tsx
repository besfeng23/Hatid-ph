import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bike,
  Briefcase,
  Car,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  Home,
  MapPin,
  Package,
  Phone,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Truck,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export type HatidIconName =
  | 'alert'
  | 'back'
  | 'bike'
  | 'briefcase'
  | 'car'
  | 'check'
  | 'clock'
  | 'creditCard'
  | 'fileText'
  | 'forward'
  | 'help'
  | 'home'
  | 'mapPin'
  | 'next'
  | 'notification'
  | 'package'
  | 'phone'
  | 'plus'
  | 'search'
  | 'settings'
  | 'shield'
  | 'star'
  | 'truck'
  | 'user'
  | 'wallet';

export const hatidIcons: Record<HatidIconName, LucideIcon> = {
  alert: AlertTriangle,
  back: ArrowLeft,
  bike: Bike,
  briefcase: Briefcase,
  car: Car,
  check: Check,
  clock: Clock,
  creditCard: CreditCard,
  fileText: FileText,
  forward: ArrowRight,
  help: HelpCircle,
  home: Home,
  mapPin: MapPin,
  next: ChevronRight,
  notification: Bell,
  package: Package,
  phone: Phone,
  plus: Plus,
  search: Search,
  settings: Settings,
  shield: Shield,
  star: Star,
  truck: Truck,
  user: User,
  wallet: Wallet,
};

export function getHatidIcon(name: HatidIconName): LucideIcon {
  return hatidIcons[name];
}
