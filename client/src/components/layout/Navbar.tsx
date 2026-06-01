import React, { useState } from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { getNavigation } from '../../config/navigation';

export const Navbar: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileRoute = user
    ? `/profile/${user.role}/${user._id}`
    : '/login';

  const dashboardRoute =
    user?.role === 'entrepreneur'
      ? '/dashboard/entrepreneur'
      : '/dashboard/investor';

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
      {/* TOP NAVBAR */}
      <nav className="bg-white shadow-md z-40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center">
              <Link to={dashboardRoute} className="text-lg font-bold text-gray-900">
                Business Nexus
              </Link>
            </div>

            {/* DESKTOP USER */}
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

            {/* MOBILE BUTTON */}
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

      {/* OVERLAY */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
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

          {/* NAV CONTENT */}
          <div className="flex-1 overflow-y-auto py-4 px-3">

            {/* MAIN ITEMS */}
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <span className="mr-3">
                      <Icon size={18} />
                    </span>
                    {item.text}
                  </NavLink>
                );
              })}
            </div>

            {/* COMMON ITEMS SECTION */}
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">

              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Settings
              </p>

              {commonItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <span className="mr-3">
                      <Icon size={18} />
                    </span>
                    {item.text}
                  </NavLink>
                );
              })}

            </div>
          </div>

          {/* FOOTER */}
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