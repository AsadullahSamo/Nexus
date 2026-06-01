import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { getNavigation } from '../../config/navigation';
import { useNotifications } from '../../hooks/useNotifications';
import { NavItems } from '../navigation/NavItems';

export const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileRoute = user
    ? `/profile/${user.role}/${user._id}`
    : '/login';

  if (!user) {
    return (
      <nav className="bg-white shadow-md z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-lg font-bold">
              Business Nexus
            </Link>

            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const { items, commonItems } = getNavigation(user._id, user.role);

  return (
    <>
      <nav className="bg-white shadow-md z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900">Business Nexus</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                leftIcon={<LogOut size={18} />}
              >
                Logout
              </Button>

              <Link to={profileRoute} className="flex items-center gap-2">
                <Avatar src={user.avatar} alt={user.name} size="sm" />
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </Link>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">

          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar src={user.avatar} alt={user.name} size="md" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">

            <div className="space-y-1">
             <NavItems
                items={items}
                unreadCount={unreadCount}
                onClick={() => setIsDrawerOpen(false)}
              />
            </div>

            <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">

              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Settings
              </p>

              <NavItems
                items={commonItems}
                unreadCount={unreadCount}
                onClick={() => setIsDrawerOpen(false)}
              />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                handleLogout();
                setIsDrawerOpen(false);
              }}
              className="flex w-full items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>

        </div>
      </div>
    </>
  );
};