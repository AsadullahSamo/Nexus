import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { User } from '../../types';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface InvestorCardProps {
  investor: User;
  showActions?: boolean;
}

export const InvestorCard: React.FC<InvestorCardProps> = ({
  investor,
  showActions = true,
}) => {
  const navigate = useNavigate();

  const handleViewProfile = () => navigate(`/profile/investor/${investor._id}`);

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chat/${investor._id}`);
  };

  return (
    <Card hoverable className="transition-all duration-300 h-full" onClick={handleViewProfile}>
      <CardBody className="flex flex-col">
        <div className="flex items-start">
          <Avatar src={investor.avatar ?? null} alt={investor.name} size="lg" className="mr-4" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{investor.name}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary" size="sm">Investor</Badge>
            </div>
          </div>
        </div>

        {investor.bio && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-3">{investor.bio}</p>
          </div>
        )}
      </CardBody>

      {showActions && (
        <CardFooter className="border-t border-gray-100 bg-gray-50 flex justify-between">
          <Button variant="outline" size="sm" leftIcon={<MessageCircle size={16} />} onClick={handleMessage}>
            Message
          </Button>
          <Button variant="primary" size="sm" rightIcon={<ExternalLink size={16} />} onClick={handleViewProfile}>
            View Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};