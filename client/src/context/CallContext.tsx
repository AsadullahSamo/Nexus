import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import socket from '../lib/socket';
import { useAuth } from './AuthContext';

interface CallerInfo {
  _id: string;
  name: string;
  avatar: string | null;
}

interface IncomingCall {
  fromUser: CallerInfo;
  roomId: string;
}

interface CallContextValue {
  initiateCall: (toUserId: string, toUserInfo: CallerInfo) => void;
  callWasDeclined: boolean;
}

const CallContext = createContext<CallContextValue | null>(null);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userRef = useRef(user);
  userRef.current = user;
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [callWasDeclined, setCallWasDeclined] = useState(false);

  useEffect(() => {

    if(!user) return;

    const connectAndRegister = () => {
      if (!userRef.current) return;
      socket.emit('user-online', userRef.current._id);
    };

    socket.off('connect');
    socket.off('incoming-call');
    socket.off('call-declined');

    socket.on('connect', connectAndRegister);

    socket.on('incoming-call', ({ fromUser, roomId }) => {
      setIncomingCall({ fromUser, roomId });
      ringtoneRef.current?.play().catch(() => {});
    });

    socket.on('call-declined', () => {
      setCallWasDeclined(true);
      window.dispatchEvent(new Event('call:declined'));
      setTimeout(() => setCallWasDeclined(false), 3000);
    });

    if (!socket.connected) {
      socket.connect();
    } else {
      connectAndRegister();
    }

    return () => {
      socket.off('connect', connectAndRegister);
      socket.off('incoming-call');
      socket.off('call-declined');
    };
  }, [user]);

  useEffect(() => {
    ringtoneRef.current = new Audio('/ringtone.mp3');
    ringtoneRef.current.loop = true;
    return () => {
      ringtoneRef.current?.pause();
    };
  }, []);

  const initiateCall = useCallback(
    (toUserId: string, toUserInfo: CallerInfo) => {
      if (!user) return;
      const roomId = [user._id, toUserId].sort().join('-');
      socket.emit('call-request', {
        toUserId,
        fromUser: { _id: user._id, name: user.name, avatar: user.avatar },
        roomId,
      });
      navigate(`/video-call/${roomId}`);
    },
    [user, navigate]
  );

  const acceptCall = () => {
    if (!incomingCall) return;
    ringtoneRef.current?.pause();
    ringtoneRef.current!.currentTime = 0;
    const roomId = incomingCall.roomId;
    setIncomingCall(null);
    navigate(`/video-call/${roomId}`);
  };

  const declineCall = () => {
    if (!incomingCall) return;
    ringtoneRef.current?.pause();
    ringtoneRef.current!.currentTime = 0;
    socket.emit('call-declined', { toUserId: incomingCall.fromUser._id });
    setIncomingCall(null);
  };

  return (
    <CallContext.Provider value={{ initiateCall, callWasDeclined }}>
      {children}

      {incomingCall && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 w-80">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
              {incomingCall.fromUser.avatar ? (
                <img
                  src={incomingCall.fromUser.avatar}
                  alt={incomingCall.fromUser.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-2xl font-bold text-primary-600">
                  {incomingCall.fromUser.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Incoming video call</p>
              <h2 className="text-xl font-semibold text-gray-900 mt-1">
                {incomingCall.fromUser.name}
              </h2>
            </div>

            <div className="flex gap-6">
              <button
                onClick={declineCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ pointerEvents: 'none' }}>
                  <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.26 8.18 19.79 19.79 0 0 1 1.19 5.55 2 2 0 0 1 3.2 3.37h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.18 11.31" />
                  <line x1="23" y1="1" x2="1" y2="23" />
                </svg>
              </button>

              <button
                onClick={acceptCall}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ pointerEvents: 'none' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.26 8.18 19.79 19.79 0 0 1 1.19 5.55 2 2 0 0 1 3.2 3.37h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.18 10.18a16 16 0 0 0 6.56 6.56l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {callWasDeclined && createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] bg-gray-900 text-white px-5 py-3 rounded-lg shadow-lg">
          Call was declined
        </div>,
        document.body
      )}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error('useCall must be used within CallProvider');
  return context;
};