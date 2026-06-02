export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio: string;
  isVerified?: boolean;
  otpEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isDeleted: boolean
  isEdited: boolean;
  createdAt: string
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface Meeting {
  _id: string;
  title: string;
  description: string | null;
  scheduledAt: string;
  duration: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  organizer: User;
  participant: User;
  createdAt: string;
}

export interface Transaction {
  _id: string;
  from?: { _id: string; name: string; email: string };
  to?: { _id: string; name: string; email: string };
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  stripePaymentIntentId?: string;
  createdAt: string;
}

export interface EntrepreneurProfile {
  _id: string;
  user: string;
  startupName: string;
  industry: string;
  pitchSummary: string;
  fundingNeeded: string;
  location: string;
  foundedYear: number | null;
  teamSize: number | null;
}

export interface InvestorProfile {
  _id: string;
  user: string;
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  minimumInvestment: string;
  maximumInvestment: string;
  totalInvestments: number;
}

export interface Notification {
  _id: string;
  type: 'meeting_request' | 'meeting_accepted' | 'meeting_rejected' | 'meeting_cancelled' | 'new_message' | 'transfer_received' | 'deal_created' | 'deal_updated' | 'deal_deleted';
  title: string;
  body: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface Deal {
  _id: string;
  investor: { _id: string; name: string; avatar: string | null; role: string };
  entrepreneur: { _id: string; name: string; avatar: string | null; role: string };
  amount: string;
  equity: string;
  stage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B';
  status: 'Due Diligence' | 'Term Sheet' | 'Negotiation' | 'Closed' | 'Passed';
  notes: string;
  createdAt: string;
}