import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, TrendingUp, Users } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useEntrepreneurProfile } from '../../hooks/useExtendedProfile';

export const EntrepreneurProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: entrepreneur, isLoading } = useProfile(id ?? '');
  const { data: p } = useEntrepreneurProfile(id ?? '');

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
        <p className="text-gray-600 mt-2">This profile doesn't exist or was removed.</p>
      </div>
    );
  }

  const isCurrentUser = currentUser?._id === entrepreneur._id;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4 sm:p-6">

      {/* HEADER */}
      <Card>
        <CardBody className="flex flex-col sm:flex-row justify-between gap-6 p-6">

          <div className="flex items-center gap-5">
            <Avatar src={entrepreneur.avatar ?? null} size="xl" alt="Entreprenur Avatar" />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {entrepreneur.name}
              </h1>

              <p className="text-gray-600">{entrepreneur.email}</p>

              <div className="flex gap-2 mt-2">
                <Badge variant="primary">Entrepreneur</Badge>
                {entrepreneur.isVerified && <Badge variant="success">Verified</Badge>}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isCurrentUser && (
              <Button
                leftIcon={<MessageCircle size={18} />}
                onClick={() => navigate(`/chat/${entrepreneur._id}`)}
              >
                Message
              </Button>
            )}
          </div>

        </CardBody>
      </Card>

      <Card>
        <CardBody className="grid grid-cols-3 gap-4">

          <div>
            <p className="text-xs text-gray-500">Funding Needed</p>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} />
              <p className="font-semibold">{p?.fundingNeeded || 'N/A'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500">Team Size</p>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <p className="font-semibold">{p?.teamSize || 'N/A'}</p>
            </div>
          </div>

        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Startup Overview</h2>
        </CardHeader>

        <CardBody className="space-y-4">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-gray-500">Startup</p>
              <p className="font-medium">{p?.startupName || '—'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Industry</p>
              <p className="font-medium">{p?.industry || '—'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Founded</p>
              <p className="font-medium">{p?.foundedYear || '—'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="font-medium">{p?.location || '—'}</p>
            </div>

          </div>

        </CardBody>
      </Card>

      {p?.pitchSummary && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Pitch Summary</h2>
          </CardHeader>

          <CardBody>
            <p className="text-gray-700 leading-relaxed">
              {p.pitchSummary}
            </p>
          </CardBody>
        </Card>
      )}

    </div>
  );
};