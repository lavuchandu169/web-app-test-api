
const express = require('express');
const router = express.Router();
const nasaController = require('../controllers/nasaController');

// APOD (Astronomy Picture of the Day)
router.get('/apod', nasaController.getAPOD);

// Mars Rover Photos
router.get('/mars/:rover/photos', nasaController.getMarsPhotos);

// Near-Earth Objects
router.get('/neo', nasaController.getNEOData);

// EPIC Earth Imagery
router.get('/epic/images', nasaController.getEPICImages);

// NASA Image and Video Library Search
router.get('/search', nasaController.searchLibrary);

module.exports = router;
