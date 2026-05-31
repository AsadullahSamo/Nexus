const { Server } =  require("socket.io")

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('user-online', (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
    });

    socket.on('call-request', ({ toUserId, fromUser, roomId }) => {
      const receiverSocketId = onlineUsers.get(toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('incoming-call', { fromUser, roomId });
      }
    });

    socket.on('call-declined', ({ toUserId }) => {
      const callerSocketId = onlineUsers.get(toUserId);
      if (callerSocketId) {
        io.to(callerSocketId).emit('call-declined');
      }
    });

    socket.on('cancel-call', ({ toUserId }) => {
      const receiverSocketId = onlineUsers.get(toUserId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('call-cancelled');
      }
    });

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('offer', ({ roomId, offer }) => {
      socket.to(roomId).emit('offer', { offer, from: socket.id });
    });

    socket.on('answer', ({ roomId, answer }) => {
      socket.to(roomId).emit('answer', { answer, from: socket.id });
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
      socket.to(roomId).emit('ice-candidate', { candidate, from: socket.id });
    });

    socket.on('leave-room', (roomId) => {
      socket.to(roomId).emit('user-left', socket.id);
      socket.leave(roomId);
    });

    // messages
    socket.on('send-message', ({ receiverId, message }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new-message', message);
      }
    });

    socket.on('disconnect', () => {
      if (socket.userId) onlineUsers.delete(socket.userId);
      io.emit('user-left', socket.id);
    });
   
  });
};

module.exports = initSocket;