import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DollarSign, ArrowDownCircle, ArrowUpCircle, ArrowRightCircle, Search, X } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { User } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useTransactions, useDeposit, useWithdraw, useTransfer, useBalance } from '../../hooks/useTransactions';
import { format } from 'date-fns';
import api from '../../lib/api';

export const PaymentsPage: React.FC = () => {
  const { data: balance = 0 } = useBalance();
  const { data: transactions = [], isLoading } = useTransactions();

  const { mutate: deposit, isPending: isDepositing } = useDeposit();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw();
  const { mutate: transfer, isPending: isTransferring } = useTransfer();
  const [form, setForm] = useState({deposit: '', withdraw: '', transferAmount: '', transferTo: ''});
  const [recipientQuery, setRecipientQuery] = useState('');
  const [recipientResults, setRecipientResults] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRecipientSearch = useCallback((q: string) => {
    setRecipientQuery(q);
    setSelectedRecipient(null);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim()) { setRecipientResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users?q=${encodeURIComponent(q)}`);
        setRecipientResults(res.data.users ?? []);
      } catch {
        setRecipientResults([]);
      }
    }, 300);
  }, []);

  const handleDeposit = () => {
    const amount = parseFloat(form.deposit);
    deposit(amount, {
      onSuccess: () => { setSuccess('Deposit successful'); setForm(prev => ({...prev, deposit: ''})); setTimeout(() => setSuccess(''), 3000); },
      onError: (err: any) => { setError(err.response?.data?.message ?? 'Deposit failed'); setTimeout(() => setError(''), 3000); }
    });
  };

  const handleWithdraw = () => {
    const amount = parseFloat(form.withdraw);
    withdraw(amount, {
      onSuccess: () => { setSuccess('Withdrawal successful'); setForm(prev => ({...prev, withdraw: ''})); setTimeout(() => setSuccess(''), 3000); },
      onError: (err: any) => { setError(err.response?.data?.message ?? 'Withdrawal failed'); setTimeout(() => setError(''), 3000); }
    });
  };

  const handleTransfer = () => {
    if (!selectedRecipient) { setError('Select a recipient'); return; }

    const amount = parseFloat(form.transferAmount);
			if (!amount || amount < 1) {
				setError('Please enter a valid amount');
				return;
			}
			transfer({ amount, toUserId: selectedRecipient._id  }, {
				onSuccess: () => { 
          setSuccess('Transfer successful'); 
          setRecipientQuery('');
          setSelectedRecipient(null);
          setRecipientResults([]);
          setForm(prev => ({...prev, transferAmount: '', transferTo: ''})); 
          setTimeout(() => setSuccess(''), 3000); 
        },
				onError: (err: any) => { setError(err.response?.data?.message ?? 'Transfer failed'); setTimeout(() => setError(''), 3000); }
			});
  };

  const getStatusVariant = (status: string) => {
    if (status === 'completed') return 'success';
    if (status === 'failed') return 'error';
    return 'gray';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'deposit') return <ArrowDownCircle size={16} className="text-success-600" />;
    if (type === 'withdraw') return <ArrowUpCircle size={16} className="text-error-600" />;
    return <ArrowRightCircle size={16} className="text-primary-600" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage deposits, withdrawals and transfers</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
        <DollarSign size={20} className="text-success-600" />
        <div>
          <p className="text-sm text-gray-600">Current Balance</p>
          <p className="text-xl font-bold text-gray-900">${balance?.toFixed(2) ?? '0.00'}</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowDownCircle size={18} className="text-success-600" />
              <h2 className="text-lg font-medium text-gray-900">Deposit</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Amount (USD)"
              type="number"
              min="1"
              value={form.deposit}
              onChange={(e) => setForm(prev => ({...prev, deposit: e.target.value}))}
              startAdornment={<DollarSign size={16} />}
            />
            <Button
              className="w-full"
              disabled={isDepositing}
              isLoading={isDepositing}
              onClick={() => handleDeposit()}
            >
              Deposit
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowUpCircle size={18} className="text-error-600" />
              <h2 className="text-lg font-medium text-gray-900">Withdraw</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Amount (USD)"
              type="number"
              min="1"
              value={form.withdraw}
              onChange={(e) => setForm(prev => ({...prev, withdraw: e.target.value}))}
              startAdornment={<DollarSign size={16} />}
            />
            <Button
              className="w-full"
              variant="outline"
              disabled={isWithdrawing}
              isLoading={isWithdrawing}
              onClick={() => handleWithdraw()}
            >
              Withdraw
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowRightCircle size={18} className="text-primary-600" />
              <h2 className="text-lg font-medium text-gray-900">Transfer</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
              {selectedRecipient ? (
                <div className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <span className="text-sm text-gray-900">{selectedRecipient.name}</span>
                  <button onClick={() => { setSelectedRecipient(null); setRecipientQuery(''); }}>
                    <X size={14} className="text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={recipientQuery}
                      onChange={(e) => handleRecipientSearch(e.target.value)}
                      placeholder="Search by name..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  {recipientResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {recipientResults.map((u) => (
                        <button
                          key={u._id}
                          onClick={() => { setSelectedRecipient(u); setRecipientResults([]); setRecipientQuery(''); }}
                          className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-50 text-left"
                        >
                          <span className="font-medium text-gray-900 mr-2">{u.name}</span>
                          <span className="text-gray-500 capitalize text-xs">{u.role}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <Input
              label="Amount (USD)"
              type="number"
              min="1"
              value={form.transferAmount}
              onChange={(e) => setForm(prev => ({...prev, transferAmount: e.target.value}))}
              startAdornment={<DollarSign size={16} />}
            />
            <Button
              className="w-full"
              variant="outline"
              disabled={isTransferring}
              isLoading={isTransferring}
              onClick={() => handleTransfer()}
            >
              Transfer
            </Button>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">From</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm capitalize">
                          {getTypeIcon(tx.type)}
                          {tx.type}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tx.from?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {tx.to?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={getStatusVariant(tx.status)}>{tx.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {format(new Date(tx.createdAt), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};