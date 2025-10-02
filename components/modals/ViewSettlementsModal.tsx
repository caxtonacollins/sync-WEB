'use client';

import React, { useState } from 'react';
import { XMarkIcon, BoltIcon, CheckCircleIcon, ClockIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ViewSettlementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Settlement {
  id: string;
  type: 'payment' | 'transfer' | 'bridge' | 'stake';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  settlementTime: number; // in seconds
  from: string;
  to: string;
  txHash?: string;
}

const ViewSettlementsModal: React.FC<ViewSettlementsModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  // Mock settlement data
  const settlements: Settlement[] = [
    {
      id: '1',
      type: 'payment',
      amount: 5000,
      currency: 'NGN',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      settlementTime: 1.1,
      from: 'Fiat Wallet',
      to: 'Merchant ABC',
      txHash: '0x1234...5678'
    },
    {
      id: '2',
      type: 'bridge',
      amount: 100,
      currency: 'USDC',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      settlementTime: 0.9,
      from: 'Crypto Wallet',
      to: 'USDC-NGN Pool',
      txHash: '0xabcd...efgh'
    },
    {
      id: '3',
      type: 'transfer',
      amount: 2500,
      currency: 'NGN',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      settlementTime: 1.3,
      from: 'Fiat Wallet',
      to: 'John Doe',
      txHash: '0x9876...5432'
    },
    {
      id: '4',
      type: 'stake',
      amount: 500,
      currency: 'SYNC',
      status: 'completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      settlementTime: 1.5,
      from: 'SYNC Wallet',
      to: 'Staking Pool',
      txHash: '0xfedc...ba98'
    },
    {
      id: '5',
      type: 'payment',
      amount: 15000,
      currency: 'NGN',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 30),
      settlementTime: 0,
      from: 'Fiat Wallet',
      to: 'Merchant XYZ'
    },
  ];

  const filteredSettlements = settlements.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      payment: '💳',
      transfer: '↔️',
      bridge: '🌉',
      stake: '🔒'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-900 text-green-400',
      pending: 'bg-yellow-900 text-yellow-400',
      failed: 'bg-red-900 text-red-400'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-900 text-gray-400';
  };

  const formatTime = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    total: settlements.length,
    completed: settlements.filter(s => s.status === 'completed').length,
    avgTime: (settlements.filter(s => s.status === 'completed')
      .reduce((acc, s) => acc + s.settlementTime, 0) / 
      settlements.filter(s => s.status === 'completed').length).toFixed(1),
    successRate: ((settlements.filter(s => s.status === 'completed').length / settlements.length) * 100).toFixed(1)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BoltIcon className="h-6 w-6 text-yellow-400 mr-2" />
              <h2 className="text-2xl font-bold text-white">Settlement History</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Today</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.avgTime}s</div>
              <div className="text-sm text-gray-400">Avg Time</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.successRate}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mb-4">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'all' ? 'bg-blue-600' : 'border-gray-600 text-gray-300'}
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('completed')}
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'completed' ? 'bg-green-600' : 'border-gray-600 text-gray-300'}
            >
              Completed
            </Button>
            <Button
              onClick={() => setFilter('pending')}
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              className={filter === 'pending' ? 'bg-yellow-600' : 'border-gray-600 text-gray-300'}
            >
              Pending
            </Button>
          </div>

          {/* Settlements List */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredSettlements.map((settlement) => (
              <div
                key={settlement.id}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">{getTypeIcon(settlement.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white capitalize">
                          {settlement.type}
                        </span>
                        <Badge className={getStatusBadge(settlement.status)}>
                          {settlement.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span>{settlement.from}</span>
                          <span>→</span>
                          <span>{settlement.to}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {formatTime(settlement.timestamp)}
                          </span>
                          {settlement.status === 'completed' && (
                            <span className="flex items-center text-green-400">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Settled in {settlement.settlementTime}s
                            </span>
                          )}
                        </div>
                        {settlement.txHash && (
                          <div className="text-xs text-gray-500 font-mono">
                            Tx: {settlement.txHash}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {settlement.amount.toLocaleString()} {settlement.currency}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredSettlements.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">No settlements found</div>
                <p className="text-sm text-gray-600">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Showing {filteredSettlements.length} of {settlements.length} settlements
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewSettlementsModal;
