
const nasaService = require('../services/nasaService');

class NASAController {
  // APOD (Astronomy Picture of the Day)
  async getAPOD(req, res) {
    try {
      const data = await nasaService.getAPOD();
      res.json(data);
    } catch (error) {
      console.error('APOD Controller Error:', error);
      res.status(500).json({
        error: 'Failed to fetch APOD data',
        message: error.message
      });
    }
  }

  // Mars Rover Photos
  async getMarsPhotos(req, res) {
    try {
      const { rover } = req.params;
      const { sol, camera } = req.query;

      if (!rover || !sol) {
        return res.status(400).json({
          error: 'Missing required parameters',
          message: 'Rover and sol parameters are required'
        });
      }

      const data = await nasaService.getMarsPhotos(rover, sol, camera);
      res.json(data);
    } catch (error) {
      console.error('Mars Photos Controller Error:', error);
      res.status(500).json({
        error: 'Failed to fetch Mars photos',
        message: error.message
      });
    }
  }

  // Near-Earth Objects
  async getNEOData(req, res) {
    try {
      const { start_date, end_date } = req.query;
      const data = await nasaService.getNEOData(start_date, end_date);
      res.json(data);
    } catch (error) {
      console.error('NEO Controller Error:', error);
      res.status(500).json({
        error: 'Failed to fetch NEO data',
        message: error.message
      });
    }
  }

  // EPIC Earth Imagery
  async getEPICImages(req, res) {
    try {
      const { date } = req.query;
      const data = await nasaService.getEPICImages(date);
      res.json(data);
    } catch (error) {
      console.error('EPIC Controller Error:', error);
      res.status(500).json({
        error: 'Failed to fetch EPIC images',
        message: error.message
      });
    }
  }

  // NASA Image and Video Library Search
  async searchLibrary(req, res) {
    try {
      const { q: query, media_type, page = 1, page_size = 20 } = req.query;

      if (!query) {
        return res.status(400).json({
          error: 'Missing required parameter',
          message: 'Query parameter is required'
        });
      }

      const data = await nasaService.searchLibrary(query, media_type, page, page_size);
      res.json(data);
    } catch (error) {
      console.error('NASA Library Search Controller Error:', error);
      res.status(500).json({
        error: 'Failed to search NASA library',
        message: error.message
      });
    }
  }
}

module.exports = new NASAController();
