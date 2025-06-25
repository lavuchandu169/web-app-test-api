
const fetch = require('node-fetch');

class NASAService {
  constructor() {
    this.apiKey = process.env.NASA_API_KEY;
    this.baseUrl = process.env.NASA_BASE_URL || 'https://api.nasa.gov';
    
    if (!this.apiKey) {
      console.warn('NASA_API_KEY not found in environment variables');
    }
  }

  // APOD (Astronomy Picture of the Day)
  async getAPOD() {
    try {
      const response = await fetch(
        `${this.baseUrl}/planetary/apod?api_key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('APOD Service Error:', error);
      throw error;
    }
  }

  // Mars Rover Photos
  async getMarsPhotos(rover, sol, camera = null) {
    try {
      let url = `${this.baseUrl}/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${this.apiKey}`;
      
      if (camera && camera !== 'all') {
        url += `&camera=${camera}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Limit to 20 photos to avoid large responses
      return {
        ...data,
        photos: data.photos.slice(0, 20)
      };
    } catch (error) {
      console.error('Mars Photos Service Error:', error);
      throw error;
    }
  }

  // Near-Earth Objects
  async getNEOData(startDate = null, endDate = null) {
    try {
      let start, end;
      
      if (!startDate || !endDate) {
        const today = new Date();
        const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        start = today.toISOString().split('T')[0];
        end = weekLater.toISOString().split('T')[0];
      } else {
        start = startDate;
        end = endDate;
      }
      
      const response = await fetch(
        `${this.baseUrl}/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NEO Service Error:', error);
      throw error;
    }
  }

  // EPIC Earth Imagery
  async getEPICImages(date = null) {
    try {
      let url = `${this.baseUrl}/EPIC/api/natural`;
      
      if (date) {
        const formattedDate = date.replace(/-/g, '/');
        url += `/date/${formattedDate}`;
      }
      
      url += `?api_key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
      }
      
      const images = await response.json();
      
      // Add full image URLs
      return images.map(image => ({
        ...image,
        imageUrl: this.getEPICImageUrl(image)
      }));
    } catch (error) {
      console.error('EPIC Service Error:', error);
      throw error;
    }
  }

  getEPICImageUrl(image) {
    const dateStr = image.date.split(' ')[0].replace(/-/g, '/');
    return `${this.baseUrl}/EPIC/archive/natural/${dateStr}/png/${image.image}.png?api_key=${this.apiKey}`;
  }

  // NASA Image and Video Library Search
  async searchLibrary(query, mediaType = 'all', page = 1, pageSize = 20) {
    try {
      let url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
      
      if (mediaType && mediaType !== 'all') {
        url += `&media_type=${mediaType}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('NASA Library Search Service Error:', error);
      throw error;
    }
  }
}

module.exports = new NASAService();
