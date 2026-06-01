import {
  Home, Building2, CircleDollarSign, Users, MessageCircle, Bell,
  FileText, Settings, HelpCircle, Calendar, Wallet, 
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  icon: LucideIcon;
  text: string;
}


const sharedItems: NavItem[] = [
  { to: '/messages', icon: MessageCircle, text: 'Messages' },
  { to: '/meetings', icon: Calendar, text: 'Meetings' },
  { to: '/notifications', icon: Bell, text: 'Notifications' },
  { to: '/payments', icon: Wallet, text: 'Payments' },
];

const commonItems: NavItem[] = [
  { to: '/settings', icon: Settings, text: 'Settings' },
  { to: '/help', icon: HelpCircle, text: 'Help & Support' },
];

const getEntrepreneurItems = (userId: string): NavItem[] => [
  { to: '/dashboard/entrepreneur', icon: Home, text: 'Dashboard' },
  { to: `/profile/entrepreneur/${userId}`, icon: Building2, text: 'My Portfolio', },
  { to: '/investors', icon: CircleDollarSign, text: 'Find Investors',},
  ...sharedItems,
  { to: '/documents', icon: FileText, text: 'Documents' },
];

const getInvestorItems = (userId: string): NavItem[] => [
  { to: '/dashboard/investor', icon: Home, text: 'Dashboard' },
  { to: `/profile/investor/${userId}`, icon: CircleDollarSign, text: 'My Portfolio', },
  { to: '/entrepreneurs', icon: Users, text: 'Find Entrepreneurs', },
  ...sharedItems,
  { to: '/deals', icon: FileText, text: 'Deals' },
];

export const getNavigation = (userId: string, role: string) => {
  const items =
    role === 'entrepreneur'
      ? getEntrepreneurItems(userId)
      : getInvestorItems(userId);

  return {
    items,
    commonItems,
  };
};