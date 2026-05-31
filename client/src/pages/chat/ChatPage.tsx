import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Video, Info, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';
import { useMessages, useSendMessage } from '../../hooks/useMessages';
import { useQueryClient } from '@tanstack/react-query';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useProfile } from '../../hooks/useProfile';
import socket from '../../lib/socket';

export const ChatPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { initiateCall } = useCall();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useMessages(userId ?? '');
  const { data: chatPartner } = useProfile(userId ?? '');
  const { mutate: sendMessage, isPending } = useSendMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!currentUser || !userId) return;

    const handleNewMessage = (message: any) => {
      const isRelevant =
        (message.sender._id === userId && message.receiver._id === currentUser._id) ||
        (message.sender._id === currentUser._id && message.receiver._id === userId);

      if (isRelevant) {
        queryClient.setQueryData(['messages', userId], (old: any[] = []) => {
          const exists = old.find((m) => m._id === message._id);
          if (exists) return old;
          return [...old, message];
        });
      }

      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [userId, currentUser, queryClient]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !currentUser) return;

    sendMessage(
      { userId, content: newMessage.trim() },
      {
        onSuccess: (message) => {
          setNewMessage('');
          socket.emit('send-message', {
            receiverId: userId,
            message,
          });
        },
      }
    );
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in">
      <div className="hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200">
        <ChatUserList />
      </div>

      <div className="flex-1 flex flex-col">
        {chatPartner ? (
          <>
            <div className="border-b border-gray-200 p-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center">
                <Avatar
                  src={chatPartner.avatar}
                  alt={chatPartner.name}
                  size="md"
                  className="mr-3"
                />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">{chatPartner.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{chatPartner.role}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="border rounded-full p-2 hover:bg-primary-500 hover:text-white transition-colors"
                  aria-label="Video call"
                  title="Start video call"
                  onClick={() =>
                    initiateCall(chatPartner._id, {
                      _id: chatPartner._id,
                      name: chatPartner.name,
                      avatar: chatPartner.avatar,
                    })
                  }
                >
                  <Video size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full p-2 hover:bg-primary-500 hover:text-white transition-colors"
                  aria-label="Info"
                  title="View info"
                >
                  <Info size={18} />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600" />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-2">
                  {messages.map((message: any) => (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      isOwnMessage={message.sender._id === currentUser._id}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <MessageCircle size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
                  <p className="text-gray-500 mt-1">Send a message to start the conversation</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 flex-shrink-0">
              <form onSubmit={handleSend} className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  fullWidth
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newMessage.trim() || isPending}
                  className="rounded-full p-2 w-10 h-10 flex items-center justify-center flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <MessageCircle size={48} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-medium text-gray-700">Select a conversation</h2>
            <p className="text-gray-500 mt-2 text-center">
              Choose a contact from the list to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};