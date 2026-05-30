module.exports = {
  '/auth/register': {
    post: {
      summary: 'Register a new user',
      tags: ['Auth'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password', 'role'],
              properties: {
                name: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string', minLength: 6 },
                role: { type: 'string', enum: ['entrepreneur', 'investor'] },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  token: { type: 'string' },
                  user: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        400: { description: 'Validation error' },
        409: { description: 'Email already registered' },
      },
    },
  },

  '/auth/login': {
    post: {
      summary: 'Login with email and password',
      tags: ['Auth'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  token: { type: 'string' },
                  user: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        401: { description: 'Invalid credentials' },
      },
    },
  },

  '/auth/me': {
    get: {
      summary: 'Get current authenticated user',
      tags: ['Auth'],
      responses: {
        200: {
          description: 'Current user',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  user: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
  },

  '/auth/change-password': {
    patch: {
      summary: 'Change authenticated user password',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['currentPassword', 'newPassword'],
              properties: {
                currentPassword: { type: 'string' },
                newPassword: { type: 'string', minLength: 6 },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Password updated successfully' },
        401: { description: 'Current password incorrect' },
      },
    },
  },

  '/auth/2fa/generate': {
    post: {
      summary: 'Generate a 2FA OTP (mock - returned in response)',
      tags: ['Auth'],
      responses: {
        200: {
          description: 'OTP generated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  otp: { type: 'string' },
                },
              },
            },
          },
        },
        401: { description: 'Unauthorized' },
      },
    },
  },

  '/auth/2fa/verify': {
    post: {
      summary: 'Verify OTP and enable 2FA',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['otp'],
              properties: {
                otp: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: '2FA enabled successfully' },
        400: { description: 'Invalid or expired OTP' },
      },
    },
  },

  '/users': {
    get: {
      summary: 'Search users by name',
      tags: ['Users'],
      parameters: [
        {
          in: 'query',
          name: 'q',
          schema: { type: 'string' },
          description: 'Search query (min 2 characters)',
        },
      ],
      responses: {
        200: {
          description: 'List of matching users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  users: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/users/{id}': {
    get: {
      summary: 'Get user by ID',
      tags: ['Users'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          description: 'User found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  user: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        404: { description: 'User not found' },
      },
    },
    patch: {
      summary: 'Update user profile',
      tags: ['Users'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                bio: { type: 'string' },
                avatar: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Profile updated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  user: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
        403: { description: 'Cannot update another user profile' },
      },
    },
  },

  '/meetings': {
    get: {
      summary: 'Get all meetings for current user',
      tags: ['Meetings'],
      responses: {
        200: {
          description: 'List of meetings',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  meetings: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Meeting' },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Schedule a new meeting',
      tags: ['Meetings'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'participantId', 'scheduledAt', 'duration'],
              properties: {
                title: { type: 'string' },
                participantId: { type: 'string' },
                scheduledAt: { type: 'string', format: 'date-time' },
                duration: { type: 'integer', minimum: 15 },
                description: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Meeting scheduled',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  meeting: { $ref: '#/components/schemas/Meeting' },
                },
              },
            },
          },
        },
        400: { description: 'Validation error or scheduling conflict' },
      },
    },
  },

  '/meetings/{id}': {
    patch: {
      summary: 'Update meeting status',
      tags: ['Meetings'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: { type: 'string', enum: ['accepted', 'rejected', 'cancelled'] },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Meeting status updated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  meeting: { $ref: '#/components/schemas/Meeting' },
                },
              },
            },
          },
        },
        404: { description: 'Meeting not found' },
      },
    },
    delete: {
      summary: 'Delete a cancelled or rejected meeting',
      tags: ['Meetings'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Meeting deleted' },
        403: { description: 'Only cancelled or rejected meetings can be deleted' },
        404: { description: 'Meeting not found' },
      },
    },
  },

  '/messages/conversations': {
    get: {
      summary: 'Get all conversations for current user',
      tags: ['Messages'],
      responses: {
        200: {
          description: 'List of conversations',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  conversations: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
      },
    },
  },

  '/messages/{userId}': {
    get: {
      summary: 'Get messages between current user and another user',
      tags: ['Messages'],
      parameters: [
        { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          description: 'List of messages',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  messages: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Message' },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Send a message to a user',
      tags: ['Messages'],
      parameters: [
        { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content'],
              properties: {
                content: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Message sent',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { $ref: '#/components/schemas/Message' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/documents': {
    get: {
      summary: 'Get all documents for current user',
      tags: ['Documents'],
      responses: {
        200: {
          description: 'List of documents',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  documents: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Document' },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Upload a document',
      tags: ['Documents'],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                file: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Document uploaded',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  document: { $ref: '#/components/schemas/Document' },
                },
              },
            },
          },
        },
        400: { description: 'Invalid file type or size' },
      },
    },
  },

  '/documents/{id}': {
    delete: {
      summary: 'Delete a document',
      tags: ['Documents'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Document deleted' },
        403: { description: 'Not authorized to delete this document' },
        404: { description: 'Document not found' },
      },
    },
  },

  '/documents/{id}/download': {
    get: {
      summary: 'Download a document',
      tags: ['Documents'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'File stream' },
        404: { description: 'Document not found' },
      },
    },
  },

  '/documents/{id}/signature': {
    patch: {
      summary: 'Save e-signature for a document',
      tags: ['Documents'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['signature'],
              properties: {
                signature: { type: 'string', description: 'Base64 signature image' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Signature saved' },
        404: { description: 'Document not found' },
      },
    },
  },

  '/transactions/history': {
    get: {
      summary: 'Get transaction history for current user',
      tags: ['Transactions'],
      responses: {
        200: {
          description: 'List of transactions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  transactions: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Transaction' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/transactions/balance': {
    get: {
      summary: 'Get computed balance for current user',
      tags: ['Transactions'],
      responses: {
        200: {
          description: 'Current balance',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  balance: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  },

  '/transactions/deposit': {
    post: {
      summary: 'Deposit funds via Stripe sandbox',
      tags: ['Transactions'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount'],
              properties: {
                amount: { type: 'number', minimum: 1 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Deposit successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  transaction: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
        400: { description: 'Payment failed or invalid amount' },
      },
    },
  },

  '/transactions/withdraw': {
    post: {
      summary: 'Withdraw funds',
      tags: ['Transactions'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount'],
              properties: {
                amount: { type: 'number', minimum: 1 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Withdrawal successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  transaction: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
        400: { description: 'Insufficient balance or invalid amount' },
      },
    },
  },

  '/transactions/transfer': {
    post: {
      summary: 'Transfer funds to another user',
      tags: ['Transactions'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['amount', 'toUserId'],
              properties: {
                amount: { type: 'number', minimum: 1 },
                toUserId: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Transfer successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  transaction: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
        400: { description: 'Insufficient balance or invalid amount' },
        404: { description: 'Recipient not found' },
      },
    },
  },
};