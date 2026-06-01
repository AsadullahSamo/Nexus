const Notification = require('../models/Notification');

const createNotification = async ({ recipient, type, title, body, link }) => {
  try {
    await Notification.create({ recipient, type, title, body, link });
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

module.exports = createNotification;