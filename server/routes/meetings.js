const { Router } = require('express');
const { body } = require('express-validator');
const { scheduleMeeting, getMyMeetings, updateMeetingStatus } = require('../controllers/meetingController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/', getMyMeetings);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('participantId').notEmpty().withMessage('Participant is required'),
    body('scheduledAt').isISO8601().withMessage('Valid date and time is required'),
    body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
  ],
  scheduleMeeting
);

router.patch(
  '/:id',
  [
    body('status')
      .isIn(['accepted', 'rejected', 'cancelled'])
      .withMessage('Invalid status'),
  ],
  updateMeetingStatus
);

module.exports = router;