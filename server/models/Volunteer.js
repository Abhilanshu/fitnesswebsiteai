const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  skills: [String],
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  availability: {
    type: Number, // 1 (low) to 10 (high)
    default: 10
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Need'
  }]
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
