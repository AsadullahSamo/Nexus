import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNavigation } from '../../config/navigation';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const { items, commonItems } = getNavigation(user._id, user.role);

  const renderItem = (item: any) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
            isActive
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`
        }
      >
        <span className="mr-3">
          <Icon size={18} />
        </span>
        <span className="text-sm font-medium">{item.text}</span>
      </NavLink>
    );
  };

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">

        {/* MAIN NAV */}
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {items.map(renderItem)}
          </div>

          {/* COMMON SECTION */}
          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>

            <div className="mt-2 space-y-1">
              {commonItems.map(renderItem)}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-600">Need assistance?</p>
            <h4 className="text-sm font-medium text-gray-900 mt-1">
              Contact Support
            </h4>
            <a
              href="mailto:support@businessnexus.com"
              className="mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500"
            >
              support@businessnexus.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};