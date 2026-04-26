const Volunteer = require('../models/Volunteer');
const Need = require('../models/Need');
const { calculateMatchScore } = require('../utils/matching');

exports.createVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.matchVolunteers = async (req, res) => {
  try {
    const { needId } = req.params;
    const need = await Need.findById(needId);
    if (!need) return res.status(404).json({ message: 'Need not found' });

    const volunteers = await Volunteer.find({ isAvailable: true });
    
    const matches = volunteers.map(vol => {
      const { score, distance } = calculateMatchScore(vol, need);
      return {
        volunteer: vol,
        score,
        distance
      };
    }).sort((a, b) => b.score - a.score);

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignVolunteer = async (req, res) => {
  try {
    const { needId, volunteerId } = req.body;
    const need = await Need.findById(needId);
    const vol = await Volunteer.findById(volunteerId);

    if (!need || !vol) return res.status(404).json({ message: 'Not found' });

    need.assignedVolunteers.push(volunteerId);
    need.status = 'Assigned';
    await need.save();

    vol.currentTasks.push(needId);
    vol.isAvailable = false;
    await vol.save();

    res.json({ message: 'Volunteer assigned successfully', need });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.autoAssignAll = async (req, res) => {
  try {
    const pendingNeeds = await Need.find({ status: 'Pending' }).sort({ priorityScore: -1 });
    const assignments = [];

    for (const need of pendingNeeds) {
      const availableVolunteers = await Volunteer.find({ isAvailable: true });
      if (availableVolunteers.length === 0) break;

      // Find best match for this need
      const matches = availableVolunteers.map(vol => {
        const { score } = calculateMatchScore(vol, need);
        return { volunteer: vol, score };
      }).sort((a, b) => b.score - a.score);

      if (matches.length === 0) continue;

      const bestMatch = matches[0].volunteer;

      // Assign
      need.assignedVolunteers.push(bestMatch._id);
      need.status = 'Assigned';
      await need.save();

      bestMatch.currentTasks.push(need._id);
      bestMatch.isAvailable = false;
      await bestMatch.save();

      assignments.push({ needId: need._id, volunteerId: bestMatch._id });
    }

    res.json({ message: `Successfully assigned ${assignments.length} tasks`, assignments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNeedStatus = async (req, res) => {
  try {
    const { needId, status } = req.body;
    const need = await Need.findByIdAndUpdate(needId, { status }, { new: true });
    
    if (status === 'Resolved') {
      // Free up volunteers assigned to this need
      await Volunteer.updateMany(
        { _id: { $in: need.assignedVolunteers } },
        { isAvailable: true, $pull: { currentTasks: needId } }
      );
    }
    
    res.json({ message: `Status updated to ${status}`, need });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
