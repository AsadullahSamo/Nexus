import React, { useState, useCallback, useRef } from 'react';
import { Search, Plus, DollarSign, TrendingUp, Users, X, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useDeals, useCreateDeal, useUpdateDeal, useDeleteDeal } from '../../hooks/useDeals';
import { Deal, User } from '../../types';
import api from '../../lib/api';

const stageColor: Record<Deal['stage'], 'primary' | 'secondary' | 'accent' | 'success' | 'error'> = {
  'Pre-seed': 'primary',
  'Seed': 'secondary',
  'Series A': 'accent',
  'Series B': 'success',
};

const statusColors: Record<Deal['status'], 'primary' | 'secondary' | 'accent' | 'success' | 'error'> = {
  'Due Diligence': 'primary',
  'Term Sheet': 'secondary',
  'Negotiation': 'accent',
  'Closed': 'success',
  'Passed': 'error',
};

const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B'] as const;
const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'] as const;

const CreateDealModal = ({ onClose }: { onClose: () => void }) => {
  const { mutate: createDeal, isPending } = useCreateDeal();
  const [form, setForm] = useState({ amount: '', equity: '', stage: 'Seed', notes: '' });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [error, setError] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setSelected(null);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim() || q.trim().length < 2) { setResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users?q=${encodeURIComponent(q)}`);
        setResults((res.data.users ?? []).filter((u: User) => u.role === 'entrepreneur'));
      } catch { setResults([]); }
    }, 300);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) { setError('Select an entrepreneur'); return; }
    if (!form.amount || !form.equity) { setError('Amount and equity are required'); return; }
    createDeal(
      { entrepreneurId: selected._id, ...form },
      { onSuccess: onClose, onError: (err: any) => setError(err.response?.data?.message ?? 'Failed to create deal') }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">New Deal</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entrepreneur</label>
            {selected ? (
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                <div className="flex items-center gap-2">
                  <Avatar src={selected.avatar ?? null} alt={selected.name} size="sm" />
                  <span className="text-sm font-medium text-gray-900">{selected.name}</span>
                </div>
                <button type="button" onClick={() => { setSelected(null); setQuery(''); }}>
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  placeholder="Search entrepreneur by name..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  fullWidth
                />
                {results.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {results.map((u) => (
                      <button
                        key={u._id}
                        type="button"
                        onClick={() => { setSelected(u); setResults([]); setQuery(''); }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                      >
                        <Avatar src={u.avatar ?? null} alt={u.name} size="sm" />
                        <span className="text-sm text-gray-900">{u.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount (e.g. $500K)"
              value={form.amount}
              onChange={(e) => setForm(p => ({ ...p, amount: e.target.value }))}
              required
            />
            <Input
              label="Equity (e.g. 10%)"
              value={form.equity}
              onChange={(e) => setForm(p => ({ ...p, equity: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              value={form.stage}
              onChange={(e) => setForm(p => ({ ...p, stage: e.target.value }))}
            >
              {stages.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Optional notes about this deal..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isPending}>Create Deal</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DealsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: deals = [], isLoading } = useDeals();
  const { mutate: updateDeal } = useUpdateDeal();
  const { mutate: deleteDeal } = useDeleteDeal();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  if (!user) return null;

  const isInvestor = user.role === 'investor';

  const filtered = deals.filter((deal) => {
    const other = isInvestor ? deal.entrepreneur : deal.investor;
    const matchesSearch = !searchQuery ||
      other.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.stage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(deal.status);
    return matchesSearch && matchesStatus;
  });

  const closedDeals = deals.filter(d => d.status === 'Closed');
  const activeDeals = deals.filter(d => !['Closed', 'Passed'].includes(d.status));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Deals</h1>
          <p className="text-gray-600">
            {isInvestor ? 'Track and manage your investment pipeline' : 'View deals initiated with you'}
          </p>
        </div>
        {isInvestor && (
          <Button leftIcon={<Plus size={18} />} onClick={() => setShowModal(true)}>
            Add Deal
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg mr-3">
                <TrendingUp size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Deals</p>
                <p className="text-lg font-semibold text-gray-900">{activeDeals.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg mr-3">
                <DollarSign size={20} className="text-success-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Closed Deals</p>
                <p className="text-lg font-semibold text-gray-900">{closedDeals.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-lg mr-3">
                <Users size={20} className="text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Deals</p>
                <p className="text-lg font-semibold text-gray-900">{deals.length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name or stage..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startAdornment={<Search size={18} />}
          fullWidth
        />
        <div className="flex flex-wrap gap-2 items-center">
          {statuses.map((s) => (
            <Badge
              key={s}
              variant={selectedStatus.includes(s) ? statusColors[s] : 'gray'}
              className={`cursor-pointer select-none transition-all ${
                selectedStatus.includes(s)
                  ? 'ring-2 ring-primary-300'
                  : ''
              }`}
              onClick={() =>
                setSelectedStatus((prev) =>
                  prev.includes(s)
                    ? prev.filter((item) => item !== s)
                    : [...prev, s]
                )
              }
            >
              {s}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            {filtered.length} {filtered.length === 1 ? 'Deal' : 'Deals'}
          </h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-sm">
                {isInvestor ? 'No deals yet. Click Add Deal to get started.' : 'No deals have been initiated with you yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {isInvestor ? 'Entrepreneur' : 'Investor'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    {isInvestor && (
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((deal) => {
                    const other = isInvestor ? deal.entrepreneur : deal.investor;
                    return (
                      <tr key={deal._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar src={other.avatar ?? null} alt={other.name} size="sm" />
                            <span className="text-sm font-medium text-gray-900">{other.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{deal.amount}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{deal.equity}</td>
                        <td className="px-4 py-3">
                          {isInvestor ? (
                            <select
                              className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                              value={deal.stage}
                              onChange={(e) => updateDeal({ id: deal._id, data: { stage: e.target.value as Deal['stage'] } })}
                            >
                              {stages.map(s => <option key={s}>{s}</option>)}
                            </select>
                          ) : (
                            <Badge variant={stageColor[deal.stage]}>{deal.stage}</Badge>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isInvestor ? (
                            <select
                              className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                              value={deal.status}
                              onChange={(e) => updateDeal({ id: deal._id, data: { status: e.target.value as Deal['status'] } })}
                            >
                              {statuses.map(s => <option key={s}>{s}</option>)}
                            </select>
                          ) : (
                            <Badge variant={statusColors[deal.status]}>{deal.status}</Badge>
                          )}
                        </td>
                        {isInvestor && (
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => deleteDeal(deal._id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {showModal && <CreateDealModal onClose={() => setShowModal(false)} />}
    </div>
  );
};