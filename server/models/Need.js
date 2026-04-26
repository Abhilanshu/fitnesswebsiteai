const mongoose = require('mongoose');

const NeedSchema = new mongoose.Schema({
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  category: {
    type: String,
    enum: ['Medical', 'Food', 'Education', 'Shelter', 'Other'],
    required: true
  },
  urgency: {
    type: Number, // 1 to 5
    required: true
  },
  affectedPeople: {
    type: Number,
    required: true
  },
  description: String,
  priorityScore: {
    type: Number,
    default: 0
  },
  assignedVolunteers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer'
  }],
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Resolved'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Priority Score Calculation: (urgency * affected) - (vols * 10)
NeedSchema.pre('save', function() {
  this.priorityScore = (this.urgency * this.affectedPeople) - (this.assignedVolunteers.length * 10);
});

module.exports = mongoose.model('Need', NeedSchema);
