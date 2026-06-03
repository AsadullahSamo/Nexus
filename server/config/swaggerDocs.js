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

  '/users/browse': {
    get: {
      summary: 'Browse all users by role',
      tags: ['Users'],
      parameters: [
        {
          in: 'query',
          name: 'role',
          schema: { type: 'string', enum: ['entrepreneur', 'investor'] },
          description: 'Filter by role',
        },
      ],
      responses: {
        200: {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  users: { type: 'array', items: { $ref: '#/components/schemas/User' } },
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

  '/users/{id}/avatar': {
    patch: {
      summary: 'Upload avatar for a user',
      tags: ['Users'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                avatar: { type: 'string', format: 'binary' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Avatar uploaded',
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
        403: { description: 'Can only update own avatar' },
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

  '/messages/{messageId}': {
    delete: {
      summary: 'Delete a message',
      tags: ['Messages'],
      parameters: [
        { in: 'path', name: 'messageId', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Message deleted' },
        403: { description: 'Can only delete own messages' },
        404: { description: 'Message not found' },
      },
    },
  },

  '/messages/{messageId}': {
    patch: {
      summary: 'Edit a message',
      tags: ['Messages'],
      parameters: [
        { in: 'path', name: 'messageId', required: true, schema: { type: 'string' } },
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
        200: {
          description: 'Message updated',
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
        403: { description: 'Can only edit own messages' },
        404: { description: 'Message not found' },
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

  '/documents/{id}/share': {
    patch: {
      summary: 'Share a document with a user',
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
              required: ['userId'],
              properties: {
                userId: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Document shared successfully' },
        400: { description: 'Already shared with this user' },
        403: { description: 'Only owner can share' },
        404: { description: 'Document not found' },
      },
    },
  },

  '/documents/{id}/share/{userId}': {
    delete: {
      summary: 'Remove a user from document shared list',
      tags: ['Documents'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
        { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'User removed from shared list' },
        403: { description: 'Only owner can unshare' },
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

  '/deals': {
    get: {
      summary: 'Get all deals for current user',
      tags: ['Deals'],
      responses: {
        200: {
          description: 'List of deals',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  deals: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Deal' },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Create a new investment deal (investor only)',
      tags: ['Deals'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['entrepreneurId', 'amount', 'equity', 'stage'],
              properties: {
                entrepreneurId: { type: 'string' },
                amount: { type: 'string' },
                equity: { type: 'string' },
                stage: { type: 'string', enum: ['Pre-seed', 'Seed', 'Series A', 'Series B'] },
                notes: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Deal created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  deal: { $ref: '#/components/schemas/Deal' },
                },
              },
            },
          },
        },
        403: { description: 'Only investors can create deals' },
        404: { description: 'Entrepreneur not found' },
      },
    },
  },

  '/deals/{id}': {
    patch: {
      summary: 'Update a deal',
      tags: ['Deals'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                amount: { type: 'string' },
                equity: { type: 'string' },
                stage: { type: 'string', enum: ['Pre-seed', 'Seed', 'Series A', 'Series B'] },
                status: { type: 'string', enum: ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'] },
                notes: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Deal updated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  deal: { $ref: '#/components/schemas/Deal' },
                },
              },
            },
          },
        },
        403: { description: 'Only the investor can update this deal' },
        404: { description: 'Deal not found' },
      },
    },
    delete: {
      summary: 'Delete a deal',
      tags: ['Deals'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Deal deleted' },
        403: { description: 'Only the investor can delete this deal' },
        404: { description: 'Deal not found' },
      },
    },
  },

  '/notifications': {
    get: {
      summary: 'Get all notifications for current user',
      tags: ['Notifications'],
      responses: {
        200: {
          description: 'List of notifications',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  notifications: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Notification' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/notifications/read-all': {
    patch: {
      summary: 'Mark all notifications as read',
      tags: ['Notifications'],
      responses: {
        200: { description: 'All notifications marked as read' },
      },
    },
  },

  '/notifications/{id}/read': {
    patch: {
      summary: 'Mark a notification as read',
      tags: ['Notifications'],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: { description: 'Notification marked as read' },
        404: { description: 'Notification not found' },
      },
    },
  },

  '/profiles/entrepreneur/{userId}': {
    get: {
      summary: 'Get entrepreneur profile for a user',
      tags: ['Profiles'],
      parameters: [
        { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          description: 'Entrepreneur profile',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  profile: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
    patch: {
      summary: 'Update entrepreneur profile',
      tags: ['Profiles'],
      parameters: [
        { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                startupName: { type: 'string' },
                industry: { type: 'string' },
                pitchSummary: { type: 'string' },
                fundingNeeded: { type: 'string' },
                location: { type: 'string' },
                foundedYear: { type: 'integer' },
                teamSize: { type: 'integer' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Startup profile updated' },
        403: { description: 'Can only update own profile' },
      },
    },
  },

  '/profiles/investor/{userId}': {
    get: {
      summary: 'Get investor profile for a user',
      tags: ['Profiles'],
      parameters: [
        { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
      ],
      responses: {
        200: {
          description: 'Investor profile',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  profile: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
    patch: {
      summary: 'Update investor profile',
      tags: ['Profiles'],
      parameters: [
        { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                investmentInterests: { type: 'array', items: { type: 'string' } },
                investmentStage: { type: 'array', items: { type: 'string' } },
                portfolioCompanies: { type: 'array', items: { type: 'string' } },
                minimumInvestment: { type: 'string' },
                maximumInvestment: { type: 'string' },
                totalInvestments: { type: 'integer' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Investor profile updated' },
        403: { description: 'Can only update own profile' },
      },
    },
  },

};