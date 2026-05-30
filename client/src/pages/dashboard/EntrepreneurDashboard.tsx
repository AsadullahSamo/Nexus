import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useMeetings } from '../../hooks/useMeetings';
import { Meeting } from '../../types';

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: meetings = [] } = useMeetings();

  if (!user) return null;

  const upcomingMeetings = meetings.filter(
    (m: Meeting) => m.status === 'accepted' && new Date(m.scheduledAt) > new Date()
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        <Link to="/investors">
          <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Meetings</p>
                <h3 className="text-xl font-semibold text-primary-900">
                  {meetings.filter((m: Meeting) => m.status === 'pending').length}
                </h3>
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
                <p className="text-sm font-medium text-secondary-700">Accepted Meetings</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {meetings.filter((m: Meeting) => m.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">{upcomingMeetings.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-success-50 border border-success-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Total Meetings</p>
                <h3 className="text-xl font-semibold text-success-900">{meetings.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
          <Link to="/meetings" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
          </Link>
        </CardHeader>
        <CardBody>
          {upcomingMeetings.length > 0 ? (
            <div className="space-y-3">
              {upcomingMeetings.slice(0, 5).map((meeting: Meeting) => (
                <div key={meeting._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(meeting.scheduledAt).toLocaleDateString()} • {meeting.duration} min
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 capitalize">
                    with {meeting.organizer._id === user._id ? meeting.participant.name : meeting.organizer.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <AlertCircle size={24} className="text-gray-500" />
              </div>
              <p className="text-gray-600">No upcoming meetings</p>
              <p className="text-sm text-gray-500 mt-1">Schedule meetings with investors from the Meetings page</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};