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
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
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