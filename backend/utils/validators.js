
// Input validation utilities
const validateRover = (rover) => {
  const validRovers = ['curiosity', 'opportunity', 'spirit', 'perseverance'];
  return validRovers.includes(rover.toLowerCase());
};

const validateSol = (sol) => {
  const solNumber = parseInt(sol);
  return !isNaN(solNumber) && solNumber >= 0;
};

const validateDate = (date) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

const validateMediaType = (mediaType) => {
  const validTypes = ['all', 'image', 'video', 'audio'];
  return validTypes.includes(mediaType.toLowerCase());
};

module.exports = {
  validateRover,
  validateSol,
  validateDate,
  validateMediaType
};
