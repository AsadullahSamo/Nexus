import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../ui/Avatar';
import { Trash2, Pencil } from 'lucide-react';
import { useDeleteMessage, useEditMessage } from '../../hooks/useMessages';
import { Message } from '../../types';

interface MessageUser {
  _id: string;
  name: string;
  avatar: string | null;
}

export interface MessageUI extends Omit<Message,  'senderId' | 'receiverId'> {
  sender: MessageUser;
  receiver: MessageUser;
}

interface ChatMessageProps {
  message: MessageUI;
  isOwnMessage: boolean;
}

const ReadReceipt = ({ isRead }: { isRead: boolean }) => (
  <span className="inline-flex items-center ml-1">
    {isRead ? (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path d="M1 5L4.5 8.5L10 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 5L9.5 8.5L15 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) : (
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path d="M1 5L4.5 8.5L10 2" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 5L9.5 8.5L15 2" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
  </span>
);

export const MessageBubble = ({ message, isOwnMessage }: ChatMessageProps) => {

  const {mutate: deleteMessage} = useDeleteMessage();
  const {mutate: editMessage} = useEditMessage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content)

 const handleEdit = () => {
    if (editedText.trim() && editedText !== message.content) {
      editMessage({
        messageId: message._id,
        content: editedText.trim(),
      });
    }
    setIsEditing(false);
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwnMessage && (
        <Avatar
          src={message.sender.avatar}
          alt={message.sender.name}
          size="sm"
          className="mr-2 self-end flex-shrink-0"
        />
      )}

      <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        <div className="relative group"        >
          <div
            className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${
              message.isDeleted
                ? 'bg-gray-100 text-gray-400 italic border border-gray-200'
                : isOwnMessage
                ? 'bg-primary-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
          >
            
            {isEditing ? (
              <input
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="text-sm text-inherit px-2 py-1 bg-transparent outline-none border-none"
                onBlur={handleEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleEdit();
                  }
                  if (e.key === 'Escape') {
                    setIsEditing(false);
                    setEditedText(message.content);
                  }
                }}
              />
            ) : (
                <p className="text-sm">
                  {message.content}
                  {message.isEdited && !message.isDeleted && (
                    <span className="ml-2 text-xs opacity-70">(edited)</span>
                  )}
                </p>
            )}
          </div>

          {isOwnMessage && !message.isDeleted && (
            <>
              <button
                onClick={() => deleteMessage(message._id)}
                className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
              </button>
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditedText(message.content);
                }}
                className="absolute -left-16 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
              <Pencil size={14} className="text-gray-400 hover:text-blue-800" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
          {isOwnMessage && !message.isDeleted && (
            <ReadReceipt isRead={message.isRead} />
          )}
        </div>
      </div>

      {isOwnMessage && (
        <Avatar
          src={message.sender.avatar}
          alt={message.sender.name}
          size="sm"
          className="ml-2 self-end flex-shrink-0"
        />
      )}
    </div>
  );
};