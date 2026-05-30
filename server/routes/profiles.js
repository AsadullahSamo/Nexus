const { Router } = require('express');
const { getEntrepreneurProfile, updateEntrepreneurProfile, getInvestorProfile, updateInvestorProfile } = require('../controllers/profileController');
const authenticate = require('../middlewares/auth');

const router = Router();

router.use(authenticate);

router.get('/entrepreneur/:userId', getEntrepreneurProfile);
router.patch('/entrepreneur/:userId', updateEntrepreneurProfile);
router.get('/investor/:userId', getInvestorProfile);
router.patch('/investor/:userId', updateInvestorProfile);

module.exports = router;