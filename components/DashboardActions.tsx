"use client";

import { Phone, Wifi, Zap, Repeat, Send, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

const actions = [
  { name: 'Airtime', icon: Phone, href: '/pay-bills/airtime' },
  { name: 'Data', icon: Wifi, href: '/pay-bills/data' },
  { name: 'Electric', icon: Zap, href: '/pay-bills/electricity' },
  { name: 'Swap', icon: Repeat, href: '/swap/new' },
  { name: 'Transfer', icon: Send, href: '/wallet' },
  { name: 'More', icon: MoreHorizontal, href: '/actions' },
];

export default function DashboardActions() {
  return (
    <div className="bg-[#1a1f2b] p-4 rounded-2xl mt-6">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
        {actions.map((action) => (
          <Link href={action.href} key={action.name}>
            <div className="flex flex-col items-center justify-center space-y-2 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="bg-gray-800 p-3 rounded-full">
                <action.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <span className="text-sm font-medium text-gray-300">{action.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
