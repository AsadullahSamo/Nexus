import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageCircle, UserCircle } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';

export const EntrepreneurProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { data: entrepreneur, isLoading } = useProfile(id ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!entrepreneur || entrepreneur.role !== 'entrepreneur') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Entrepreneur not found</h2>
        <p className="text-gray-600 mt-2">This profile doesn't exist or has been removed.</p>
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?._id === entrepreneur._id;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <Avatar
              src={entrepreneur.avatar ?? null}
              alt={entrepreneur.name}
              size="xl"
              className="mx-auto sm:mx-0"
            />
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{entrepreneur.name}</h1>
              <p className="text-gray-600 mt-1">{entrepreneur.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="primary">Entrepreneur</Badge>
                {entrepreneur.isVerified && <Badge variant="success">Verified</Badge>}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex gap-2 justify-center sm:justify-end">
            {!isCurrentUser && (
              <Button
                leftIcon={<MessageCircle size={18} />}
                onClick={() => navigate(`/chat/${entrepreneur._id}`)}
              >
                Message
              </Button>
            )}
            {isCurrentUser && (
              <Button
                variant="outline"
                leftIcon={<UserCircle size={18} />}
                onClick={() => navigate('/settings')}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {entrepreneur.bio && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">About</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">{entrepreneur.bio}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};