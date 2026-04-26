const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Need = require('./models/Need');
const Volunteer = require('./models/Volunteer');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/geosmart';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Need.deleteMany({});
    await Volunteer.deleteMany({});

    // Seed Volunteers
    const volunteers = [
      {
        name: 'Dr. Priya Sharma',
        skills: ['Medical', 'Emergency'],
        location: {
          address: 'New Delhi - AIIMS Area',
          coordinates: { lat: 28.5672, lng: 77.2100 }
        },
        availability: 9
      },
      {
        name: 'Raj Patel',
        skills: ['Food', 'Logistics'],
        location: {
          address: 'Mumbai - Dadar West',
          coordinates: { lat: 19.0178, lng: 72.8478 }
        },
        availability: 10
      },
      {
        name: 'Meena Gupta',
        skills: ['Education', 'Other'],
        location: {
          address: 'Kolkata - Salt Lake',
          coordinates: { lat: 22.5867, lng: 88.4171 }
        },
        availability: 7
      },
      {
        name: 'Amit Singh',
        skills: ['Medical', 'Shelter'],
        location: {
          address: 'Bangalore - Koramangala',
          coordinates: { lat: 12.9352, lng: 77.6245 }
        },
        availability: 8
      },
      {
        name: 'Suresh Kumar',
        skills: ['Rescue', 'Driving'],
        location: {
          address: 'Chennai - Adyar',
          coordinates: { lat: 13.0067, lng: 80.2578 }
        },
        availability: 10
      }
    ];

    for (const v of volunteers) {
      const vol = new Volunteer(v);
      await vol.save();
    }
    console.log('Volunteers seeded!');

    // Seed Needs
    const needs = [
      {
        category: 'Medical',
        urgency: 5,
        affectedPeople: 340,
        location: {
          address: 'Delhi NCR - Critical Zone',
          coordinates: { lat: 28.6139, lng: 77.2090 }
        },
        description: 'Major medical emergency reported in central Delhi.',
        status: 'Pending'
      },
      {
        category: 'Food',
        urgency: 4,
        affectedPeople: 220,
        location: {
          address: 'Mumbai Slum Distribution',
          coordinates: { lat: 19.0760, lng: 72.8777 }
        },
        description: 'Urgent need for food packets in Dharavi area.',
        status: 'Pending'
      },
      {
        category: 'Shelter',
        urgency: 3,
        affectedPeople: 150,
        location: {
          address: 'Kolkata Relief Camp',
          coordinates: { lat: 22.5726, lng: 88.3639 }
        },
        description: 'Need for temporary shelters due to heavy rains.',
        status: 'Pending'
      },
      {
        category: 'Medical',
        urgency: 5,
        affectedPeople: 80,
        location: {
          address: 'Bangalore Emergency',
          coordinates: { lat: 12.9716, lng: 77.5946 }
        },
        description: 'Oxygen supply shortage reported at community center.',
        status: 'Pending'
      }
    ];

    for (const n of needs) {
      const need = new Need(n);
      // Priority calculated in pre-save hook
      await need.save();
    }
    console.log('Needs seeded!');

    console.log('Seeding complete! Closing connection...');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
