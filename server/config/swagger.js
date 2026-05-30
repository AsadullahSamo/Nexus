const paths = require('./swaggerDocs');


const options = {
    openapi: '3.0.0',
    info: {
      title: 'Nexus API',
      version: '1.0.0',
      description: 'Investor-Entrepreneur Collaboration Platform API',
    },
    servers: [{ url: 'http://localhost:5000/api'}, { url: 'https://nexus-d96z.onrender.com/api' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['entrepreneur', 'investor'] },
            avatar: { type: 'string', nullable: true },
            bio: { type: 'string', nullable: true },
            isVerified: { type: 'boolean' },
            otpEnabled: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            from: { $ref: '#/components/schemas/User' },
            to: { $ref: '#/components/schemas/User' },
            type: { type: 'string', enum: ['deposit', 'withdraw', 'transfer'] },
            amount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
            stripePaymentIntentId: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Meeting: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            scheduledAt: { type: 'string', format: 'date-time' },
            duration: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'accepted', 'rejected', 'cancelled'] },
            organizer: { $ref: '#/components/schemas/User' },
            participant: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Message: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            sender: { $ref: '#/components/schemas/User' },
            receiver: { $ref: '#/components/schemas/User' },
            content: { type: 'string' },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Document: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            originalName: { type: 'string' },
            mimetype: { type: 'string' },
            size: { type: 'number' },
            owner: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths
};

module.exports = options;