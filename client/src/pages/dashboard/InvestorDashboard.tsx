import React, { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Calendar, PlusCircle, Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../hooks/useMeetings';
import { Meeting, User } from '../../types';
import api from '../../lib/api';

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: meetings = [] } = useMeetings();

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

  if (!user) return null;

  const upcomingMeetings = meetings.filter(
    (m: Meeting) => m.status === 'accepted' && new Date(m.scheduledAt) > new Date()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Calendar size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-primary-900">{upcomingMeetings.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Pending Meetings</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {meetings.filter((m: Meeting) => m.status === 'pending').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <PieChart size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Total Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">{meetings.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Find Entrepreneurs </h2>
          <Link to="/entrepreneurs" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
          </Link>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            placeholder="Search entrepreneurs  by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            startAdornment={<Search size={18} />}
            fullWidth
          />
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
            </div>
          ) : entrepreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entrepreneurs.map((entrepreneur) => (
                <EntrepreneurCard key={entrepreneur._id} entrepreneur={entrepreneur} />
              ))}
            </div>
          ) : searchQuery.trim().length >= 2 ? (
            <p className="text-sm text-gray-500 text-center py-4">No Entrepreneurs found.</p>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Type at least 2 characters to search.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
};