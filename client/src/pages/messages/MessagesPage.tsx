import { useState, useCallback, useRef } from 'react';
import { MessageCircle, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useConversations } from '../../hooks/useMessages';
import { Button } from '../../components/ui/Button';
import { User } from '../../types';
import api from '../../lib/api';

export const MessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: conversations = [], isLoading } = useConversations();

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!q.trim() || q.trim().length < 2) { setResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/users?q=${encodeURIComponent(q)}`);
        setResults(res.data.users ?? []);
      } catch {
        setResults([]);
      }
    }, 300);
  }, []);

  const handleSelectUser = (userId: string) => {
    setShowSearch(false);
    setQuery('');
    setResults([]);
    navigate(`/chat/${userId}`);
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      {showSearch ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search users by name..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button onClick={() => { setShowSearch(false); setQuery(''); setResults([]); }}>
              <X size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          {results.length > 0 && (
            <div className="border border-gray-200 rounded-md overflow-hidden">
              {results.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleSelectUser(u._id)}
                  className="w-full flex items-center px-4 py-3 text-sm hover:bg-gray-50 text-left border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium text-gray-900 mr-2">{u.name}</span>
                  <span className="text-gray-500 capitalize text-xs">{u.role}</span>
                </button>
              ))}
            </div>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No users found.</p>
          )}
        </div>
      ) : conversations.length > 0 ? (
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-gray-200 flex justify-end">
            <Button size="sm" onClick={() => setShowSearch(true)} leftIcon={<Search size={16} />}>
              New Conversation
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatUserList />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center p-8">
          <div className="bg-gray-100 p-6 rounded-full mb-4">
            <MessageCircle size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900">No messages yet</h2>
          <p className="text-gray-600 text-center mt-2 mb-4">
            Start a conversation with an entrepreneur or investor
          </p>
          <Button onClick={() => setShowSearch(true)} leftIcon={<Search size={16} />}>
            Search Users
          </Button>
        </div>
      )}
    </div>
  );
};