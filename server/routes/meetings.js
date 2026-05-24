const { Router } = require('express');
const { body } = require('express-validator');
const { scheduleMeeting, getMyMeetings, updateMeetingStatus, deleteMeeting } = require('../controllers/meetingController');
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
    body('scheduledAt').custom((value) => {
      const scheduledDate = new Date(value);
      if (scheduledDate < new Date()) {
        throw new Error('Scheduled time must be in the future');
      }
      return true;
    }),
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

router.delete('/:id', deleteMeeting);

module.exports = router;