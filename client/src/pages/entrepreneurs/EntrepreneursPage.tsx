import React, { useState, useCallback, useRef } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { User } from '../../types';
import api from '../../lib/api';

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entrepreneurs, setEntrepreneurs] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim() || q.trim().length < 2) { setEntrepreneurs([]); return; }
    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/users?q=${encodeURIComponent(q)}`);
        const all: User[] = res.data.users ?? [];
        setEntrepreneurs(all.filter((u) => u.role === 'entrepreneur'));
      } catch {
        setEntrepreneurs([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Entrepreneurs </h1>
        <p className="text-gray-600">Discover promising entrepreneurs looking for investment</p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search entrepreneurs  by name..."
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
      ) : entrepreneurs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entrepreneurs.map((entrepreneur) => (
            <EntrepreneurCard key={entrepreneur._id} entrepreneur={entrepreneur} />
          ))}
        </div>
      ) : searchQuery.trim().length >= 2 ? (
        <p className="text-sm text-gray-500 text-center py-12">No Entrepreneurs found.</p>
      ) : (
        <p className="text-sm text-gray-500 text-center py-12">Type at least 2 characters to search.</p>
      )}
    </div>
  );
};