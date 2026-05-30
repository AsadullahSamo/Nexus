import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MessageCircle, UserCircle } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { useInvestorProfile } from '../../hooks/useExtendedProfile';

export const InvestorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { data: investor, isLoading } = useProfile(id ?? '');
  const { data: investorProfile } = useInvestorProfile(id ?? '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!investor || investor.role !== 'investor') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Investor not found</h2>
        <p className="text-gray-600 mt-2">This profile doesn't exist or has been removed.</p>
        <Link to="/dashboard/entrepreneur">
          <Button variant="outline" className="mt-4">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?._id === investor._id;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <Avatar
              src={investor.avatar ?? null}
              alt={investor.name}
              size="xl"
              className="mx-auto sm:mx-0"
            />
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{investor.name}</h1>
              <p className="text-gray-600 mt-1">{investor.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="secondary">Investor</Badge>
                {investor.isVerified && <Badge variant="success">Verified</Badge>}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex gap-2 justify-center sm:justify-end">
            {!isCurrentUser && (
              <Button
                leftIcon={<MessageCircle size={18} />}
                onClick={() => navigate(`/chat/${investor._id}`)}
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

      {investor.bio && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">About</h2>
          </CardHeader>
          <CardBody>
            <p className="text-gray-700">{investor.bio}</p>
          </CardBody>
        </Card>
      )}

      {investorProfile && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Investment Info</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {investorProfile.investmentInterests.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Investment Interests</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {investorProfile.investmentInterests.map((interest) => (
                    <Badge key={interest} variant="primary" size="sm">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            {investorProfile.investmentStage.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Investment Stage</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {investorProfile.investmentStage.map((stage) => (
                    <Badge key={stage} variant="secondary" size="sm">{stage}</Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {investorProfile.minimumInvestment && (
                <div>
                  <span className="text-sm text-gray-500">Min Investment</span>
                  <p className="text-sm font-medium text-gray-900">{investorProfile.minimumInvestment}</p>
                </div>
              )}
              {investorProfile.maximumInvestment && (
                <div>
                  <span className="text-sm text-gray-500">Max Investment</span>
                  <p className="text-sm font-medium text-gray-900">{investorProfile.maximumInvestment}</p>
                </div>
              )}
              {investorProfile.totalInvestments > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Total Investments</span>
                  <p className="text-sm font-medium text-gray-900">{investorProfile.totalInvestments} companies</p>
                </div>
              )}
            </div>
            {investorProfile.portfolioCompanies.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Portfolio Companies</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {investorProfile.portfolioCompanies.map((company) => (
                    <Badge key={company} variant="gray" size="sm">{company}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};