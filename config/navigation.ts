import {
  HomeIcon,
  UserIcon,
  ShieldCheckIcon,
  UsersIcon,
  BanknotesIcon,
  ArrowPathIcon as ArrowsRightLeftIcon,
  CreditCardIcon,
  QrCodeIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export type UserRole = "USER" | "ADMIN";

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  roles: UserRole[];
  description?: string;
}

export const navigationConfig: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    roles: ["USER", "ADMIN"],
    description: "Overview of your financial world",
  },
  {
    name: "Wallet",
    href: "/wallet",
    icon: BanknotesIcon,
    roles: ["USER", "ADMIN"],
    description: "Manage your fiat and crypto assets",
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: CreditCardIcon,
    roles: ["USER", "ADMIN"],
    description: "View transaction history",
  },
  {
    name: "Swaps",
    href: "/swaps",
    icon: ArrowsRightLeftIcon,
    roles: ["USER", "ADMIN"],
    description: "Swap between currencies",
  },
  {
    name: "SYNC Token",
    href: "/syncpay",
    icon: CurrencyDollarIcon,
    roles: ["USER", "ADMIN"],
    description: "Stake and earn rewards",
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserIcon,
    roles: ["USER", "ADMIN"],
    description: "Manage your account",
  },
  {
    name: "Security",
    href: "/settings/security",
    icon: ShieldCheckIcon,
    roles: ["USER", "ADMIN"],
    description: "Security settings",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    roles: ["USER", "ADMIN"],
    description: "App preferences",
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: UsersIcon,
    roles: ["ADMIN"],
    description: "Manage system users",
  },
];

export function getNavigationForRole(role: UserRole = 'USER'): NavigationItem[] {
  const filtered = navigationConfig.filter((item) => item.roles.includes(role));
  return filtered;
}
