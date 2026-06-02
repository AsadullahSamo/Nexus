import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { User } from '../../types';
import api from '../../lib/api';

export const InvestorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allInvestors, setAllInvestors] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/users/browse?role=investor');
        setAllInvestors(res.data.users ?? []);
        setFiltered(res.data.users ?? []);
      } catch {
        setAllInvestors([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim()) {
      setFiltered(allInvestors);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users?q=${encodeURIComponent(q)}`);
        setFiltered((res.data.users ?? []).filter((u: User) => u.role === 'investor'));
      } catch {
        setFiltered([]);
      }
    }, 300);
  }, [allInvestors]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Investors</h1>
        <p className="text-gray-600">Connect with investors who match your startup's needs</p>
      </div>

      <Input
        placeholder="Search investors by name..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        startAdornment={<Search size={18} />}
        fullWidth
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-sm text-gray-500">{filtered.length} investor{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((investor) => (
              <InvestorCard key={investor._id} investor={investor} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 text-center py-12">No investors found.</p>
      )}
    </div>
  );
};