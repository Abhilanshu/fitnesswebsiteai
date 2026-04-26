const express = require('express');
const router = express.Router();
const needController = require('../controllers/needController');

router.post('/', needController.createNeed);
router.get('/', needController.getNeeds);

module.exports = router;
