const { Router } = require('express');
const { getNotifications, markRead, markAllRead } = require('../controllers/notificationController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/', getNotifications);
router.patch('/:id/read', markRead);
router.patch('/read-all', markAllRead);

module.exports = router;