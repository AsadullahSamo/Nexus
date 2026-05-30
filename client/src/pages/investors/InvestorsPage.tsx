import React, { useState, useCallback, useRef } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { User } from '../../types';
import api from '../../lib/api';

export const InvestorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [investors, setInvestors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim() || q.trim().length < 2) { setInvestors([]); return; }
    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/users?q=${encodeURIComponent(q)}`);
        const all: User[] = res.data.users ?? [];
        setInvestors(all.filter((u) => u.role === 'investor'));
      } catch {
        setInvestors([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Investors</h1>
        <p className="text-gray-600">Connect with investors who match your startup's needs</p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search investors by name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          startAdornment={<Search size={18} />}
          fullWidth
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
        </div>
      ) : investors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investors.map((investor) => (
            <InvestorCard key={investor._id} investor={investor} />
          ))}
        </div>
      ) : searchQuery.trim().length >= 2 ? (
        <p className="text-sm text-gray-500 text-center py-12">No investors found.</p>
      ) : (
        <p className="text-sm text-gray-500 text-center py-12">Type at least 2 characters to search.</p>
      )}
    </div>
  );
};