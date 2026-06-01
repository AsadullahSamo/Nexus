import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNavigation } from '../../config/navigation';
import { useNotifications } from '../../hooks/useNotifications';
import { NavItems } from '../navigation/NavItems';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const { data: notifications = [] } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const { items, commonItems } = getNavigation(user._id, user.role);

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">

        {/* MAIN NAV */}
        <div className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            <NavItems items={items} unreadCount={unreadCount} />
          </div>

          {/* COMMON SECTION */}
          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>

            <div className="mt-2 space-y-1">
              <NavItems items={commonItems} unreadCount={unreadCount} />
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