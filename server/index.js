require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/users")
const meetingRoutes = require('./routes/meetings');
const messageRoutes = require('./routes/messages');
const documentRoutes = require('./routes/documents');

const { apiLimiter } = require('./middlewares/rateLimiter');

const errorHandler = require('./middlewares/errorHandler')
const initSocket = require('./socket')

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());



app.use('/uploads', express.static('uploads'));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const server = http.createServer(app)
    initSocket(server)

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
  
};

start();