const { validationResult } = require('express-validator');
const Meeting = require('../models/Meeting');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const scheduleMeeting = asyncHandler(async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

  const { title, description, participantId, scheduledAt, duration } = req.body;

  const requestedStart = new Date(scheduledAt);
  const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);

  const meetings = await Meeting.find({
    status: { $in: ['pending', 'accepted'] },
    $or: [{ organizer: req.user._id }, { participant: req.user._id }],
  })

  const conflict = meetings.some((meeting) => {
    const meetingStart = new Date(meeting.scheduledAt);
    const meetingEnd = new Date(meetingStart.getTime() + meeting.duration * 60000);

    return meetingStart < requestedEnd && meetingEnd > requestedStart;

  })

  if (conflict) {
    return next(new AppError('You have a conflicting meeting at this time', 409));
  }

  const meeting = await Meeting.create({
    title,
    description,
    organizer: req.user._id,
    participant: participantId,
    scheduledAt: requestedStart,
    duration,
  });

  await meeting.populate(['organizer', 'participant']);

  res.status(201).json({ success: true, meeting });
});

const getMyMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find({
    $or: [{ organizer: req.user._id }, { participant: req.user._id }],
  })
    .populate('organizer', 'name avatar role')
    .populate('participant', 'name avatar role')
    .sort({ scheduledAt: 1 });

  res.status(200).json({ success: true, meetings });
});

const updateMeetingStatus = asyncHandler(async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new AppError(errors.array()[0].msg, 400));

  const { status } = req.body;
  const meeting = await Meeting.findById(req.params.id);

  if (!meeting) return next(new AppError('Meeting not found', 404));

  const isParticipant = meeting.participant.toString() === req.user._id.toString();
  const isOrganizer = meeting.organizer.toString() === req.user._id.toString();

  if (status === 'cancelled' && !isOrganizer) {
    return next(new AppError('Only the organizer can cancel a meeting', 403));
  }

  if ((status === 'accepted' || status === 'rejected') && !isParticipant) {
    return next(new AppError('Only the participant can accept or reject a meeting', 403));
  }

  meeting.status = status;
  await meeting.save();
  await meeting.populate(['organizer', 'participant']);

  res.status(200).json({ success: true, meeting });
});

module.exports = { scheduleMeeting, getMyMeetings, updateMeetingStatus };