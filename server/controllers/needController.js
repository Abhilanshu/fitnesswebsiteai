const Need = require('../models/Need');
const { parseCrisisMessage } = require('../utils/gemini');

exports.createNeed = async (req, res) => {
  try {
    const { message } = req.body;
    let needData;

    if (message) {
      // Parse using Gemini if a message string is provided
      needData = await parseCrisisMessage(message);
      
      if (!needData) {
        throw new Error("Failed to parse crisis message and fallback also failed.");
      }

      // Major Indian Cities for random simulation across the country
      const cities = [
        { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
        { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
        { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
        { name: 'Indore', lat: 22.7196, lng: 75.8577 }
      ];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      needData.location = {
        address: needData.location || `${randomCity.name}, India`,
        coordinates: {
          lat: randomCity.lat + (Math.random() - 0.5) * 0.5,
          lng: randomCity.lng + (Math.random() - 0.5) * 0.5
        }
      };
    } else {
      needData = req.body;
    }

    const newNeed = new Need(needData);
    // Explicitly calculate priority for the new need
    const urgency = newNeed.urgency || 3;
    const people = newNeed.affectedPeople || 1;
    newNeed.priorityScore = (urgency * people) - (newNeed.assignedVolunteers.length * 10);
    
    await newNeed.save();
    res.status(201).json(newNeed);
  } catch (error) {
    console.error("CREATE NEED ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getNeeds = async (req, res) => {
  try {
    const needs = await Need.find().populate('assignedVolunteers');
    res.json(needs);
  } catch (error) {
    console.error("GET NEEDS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
