import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import socket from '../../lib/socket';
import { useAuth } from '../../context/AuthContext';
import { useCall } from '../../context/CallContext';

export const VideoCallPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callWasDeclined } = useCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);

  if (!user) return <Navigate to="/login" replace />;

  const iceServers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const createPeerConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    const pc = new RTCPeerConnection(iceServers);

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('ice-candidate', { roomId, candidate: e.candidate });
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
        setIsWaiting(false);
      }
    };

    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    peerConnectionRef.current = pc;
    return pc;
  };

  useEffect(() => {
    let socketCleanup: (() => void) | undefined;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Camera/mic access denied:', err);
        return;
      }

      socket.emit('join-room', roomId);

      const handleUserJoined = async () => {
        const pc = createPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { roomId, offer });
      };

      const handleOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
        const pc = createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, answer });
      };

      const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        if (!peerConnectionRef.current) return;
        if (peerConnectionRef.current.signalingState === 'have-local-offer') {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      };

      const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        if (!peerConnectionRef.current) return;
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('ICE error:', e);
        }
      };

      const handleUserLeft = () => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        peerConnectionRef.current?.close();
        peerConnectionRef.current = null;
        setTimeout(() => navigate('/meetings'), 1500);
      };

      socket.on('user-joined', handleUserJoined);
      socket.on('offer', handleOffer);
      socket.on('answer', handleAnswer);
      socket.on('ice-candidate', handleIceCandidate);
      socket.on('user-left', handleUserLeft);

      socketCleanup = () => {
        socket.off('user-joined', handleUserJoined);
        socket.off('offer', handleOffer);
        socket.off('answer', handleAnswer);
        socket.off('ice-candidate', handleIceCandidate);
        socket.off('user-left', handleUserLeft);
      };
    };

    init();

    return () => {
      socketCleanup?.();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      socket.emit('leave-room', roomId);
      peerConnectionRef.current?.close();
    };
  }, [roomId]);

  useEffect(() => {
    const handler = () => setTimeout(() => navigate('/meetings'), 2000);
    window.addEventListener('call:declined', handler);
    return () => window.removeEventListener('call:declined', handler);
  }, [navigate]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((prev) => !prev);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsVideoOff((prev) => !prev);
  };

  const leaveCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    socket.emit('leave-room', roomId);
    peerConnectionRef.current?.close();
    navigate('/meetings');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 relative min-h-0">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {isWaiting && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              {!callWasDeclined && (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-400 mx-auto mb-4" />
              )}
              {callWasDeclined ? (
                <p className="text-red-400 text-base font-medium">Call was declined</p>
              ) : (
                <p className="text-gray-300 text-base">Waiting for the other person to join...</p>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-24 right-4 w-36 h-28 rounded-lg overflow-hidden border-2 border-gray-700 shadow-lg bg-gray-800">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff size={20} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 px-6 py-4 flex items-center justify-center gap-4 flex-shrink-0">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-500'}`}
        >
          {isVideoOff ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
        </button>

        <button
          onClick={leaveCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
        >
          <PhoneOff size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};