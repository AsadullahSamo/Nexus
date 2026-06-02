import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { User } from '../../types';
import api from '../../lib/api';

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allEntrepreneurs, setAllEntrepreneurs] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/users/browse?role=entrepreneur');
        setAllEntrepreneurs(res.data.users ?? []);
        setFiltered(res.data.users ?? []);
      } catch {
        setAllEntrepreneurs([]);
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
      setFiltered(allEntrepreneurs);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users?q=${encodeURIComponent(q)}`);
        setFiltered((res.data.users ?? []).filter((u: User) => u.role === 'entrepreneur'));
      } catch {
        setFiltered([]);
      }
    }, 300);
  }, [allEntrepreneurs]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Entrepreneurs</h1>
        <p className="text-gray-600">Discover promising entrepreneurs looking for investment</p>
      </div>

      <Input
        placeholder="Search entrepreneurs by name..."
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
          <p className="text-sm text-gray-500">{filtered.length} entrepreneur{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((entrepreneur) => (
              <EntrepreneurCard key={entrepreneur._id} entrepreneur={entrepreneur} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 text-center py-12">No entrepreneurs found.</p>
      )}
    </div>
  );
};