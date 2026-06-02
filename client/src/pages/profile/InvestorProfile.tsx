import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
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
  const { data: p } = useInvestorProfile(id ?? '');

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
      </div>
    );
  }

  const isCurrentUser = currentUser?._id === investor._id;

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4 sm:p-6">

      <Card>
        <CardBody className="flex flex-col sm:flex-row justify-between gap-6 p-6">

          <div className="flex items-center gap-5">

            <Avatar src={investor.avatar ?? null} size="xl" alt="Investor Avatar" />

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {investor.name}
              </h1>

              <p className="text-gray-600">{investor.email}</p>

              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">Investor</Badge>
                {investor.isVerified && <Badge variant="success">Verified</Badge>}
              </div>
            </div>

          </div>

          <div className="flex gap-2">
            {!isCurrentUser && (
              <Button
                leftIcon={<MessageCircle size={18} />}
                onClick={() => navigate(`/chat/${investor._id}`)}
              >
                Message
              </Button>
            )}
          </div>

        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Investment Profile</h2>
        </CardHeader>

        <CardBody className="space-y-6">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-gray-500">Minimum Investment</p>
              <p className="font-medium">
                {p?.minimumInvestment ? `$${p.minimumInvestment}` : '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Maximum Investment</p>
              <p className="font-medium">
                {p?.maximumInvestment ? `$${p.maximumInvestment}` : '—'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Investments</p>
              <p className="font-medium">
                {p?.totalInvestments ?? 0}
              </p>
            </div>

          </div>

          {(p?.investmentInterests ?? []).length > 0 && (            
            <div>
              <p className="text-xs text-gray-500 mb-2">Investment Interests</p>
              <div className="flex flex-wrap gap-2">
                {p?.investmentInterests.map((i) => (
                  <Badge key={i} variant="primary">
                    {i}
                  </Badge>
                ))}
              </div>
            </div>
          )}

            {(p?.investmentStage ?? []).length > 0 && (            
              <div>
                <p className="text-xs text-gray-500 mb-2">Preferred Stages</p>
                <div className="flex flex-wrap gap-2">
                  {p?.investmentStage.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

        </CardBody>
      </Card>

      {(p?.investmentStage ?? []).length > 0 && (     
        <Card>
          <CardHeader>
            <h2 className="font-semibold">Portfolio</h2>
          </CardHeader>

          <CardBody>
            <div className="flex flex-wrap gap-2">
              {p?.portfolioCompanies.map((c) => (
                <Badge key={c} variant="gray">
                  {c}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

    </div>
  );
};