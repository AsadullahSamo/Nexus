const { Router } = require('express');
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.post('/:userId', sendMessage);

module.exports = router;