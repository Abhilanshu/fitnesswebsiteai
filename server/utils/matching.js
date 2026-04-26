function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function calculateMatchScore(volunteer, need) {
  // Skill Match (binary for now: 1 if matches, 0 if not)
  // In a more complex system, we'd check if any of volunteer.skills match the need.category
  const skillMatch = volunteer.skills.includes(need.category) ? 1 : 0.5;

  // Distance Match
  const distance = calculateDistance(
    volunteer.location.coordinates.lat,
    volunteer.location.coordinates.lng,
    need.location.coordinates.lat,
    need.location.coordinates.lng
  );
  
  // Prevent division by zero, min distance 0.1km
  const distanceScore = 1 / Math.max(distance, 0.1);

  // Availability
  const availabilityScore = volunteer.availability / 10;

  // Final Score: (skill*60) + (dist_score*30) + (avail*10)
  // We normalize distanceScore to a reasonable range for the weight
  const weightedScore = (skillMatch * 60) + (Math.min(distanceScore, 5) * 6) + (availabilityScore * 10);
  
  return {
    score: Math.round(weightedScore),
    distance: distance.toFixed(2)
  };
}

module.exports = { calculateMatchScore };
