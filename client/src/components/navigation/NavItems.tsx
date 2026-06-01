import React from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
  items: any[];
  unreadCount?: number;
  onClick?: () => void;
};

export const NavItems: React.FC<Props> = ({
  items,
  unreadCount = 0,
  onClick,
}) => {
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="mr-3 relative">
              <Icon size={18} />

              {item.to === '/notifications' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>

            {item.text}
          </NavLink>
        );
      })}
    </>
  );
};