const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.post('/', volunteerController.createVolunteer);
router.get('/', volunteerController.getVolunteers);
router.get('/match/:needId', volunteerController.matchVolunteers);
router.post('/assign', volunteerController.assignVolunteer);
router.post('/auto-assign', volunteerController.autoAssignAll);
router.post('/update-status', volunteerController.updateNeedStatus);

module.exports = router;
