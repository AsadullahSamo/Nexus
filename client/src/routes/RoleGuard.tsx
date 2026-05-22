import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
  allowedRole: 'entrepreneur' | 'investor';
}

const RoleGuard = ({ allowedRole }: RoleGuardProps) => {
  const { user } = useAuth();

  if (user?.role !== allowedRole) {
    return (
      <Navigate
        to={user?.role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor'}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleGuard;