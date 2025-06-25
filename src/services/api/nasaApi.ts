// NASA API service - now calls our backend endpoints
import { API_CONFIG } from '../../config/api';

export class NASAApiService {
  private static baseUrl = API_CONFIG.BACKEND_BASE_URL;

  // APOD (Astronomy Picture of the Day)
  static async getAPOD() {
    try {
      const response = await fetch(`${this.baseUrl}/nasa/apod`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch APOD data' }));
        throw new Error(errorData.message || 'Failed to fetch APOD data');
      }

      return await response.json();
    } catch (error) {
      console.error('APOD API Error:', error);
      throw error;
    }
  }

  // Mars Rover Photos
  static async getMarsPhotos(rover: string, sol: string, camera?: string) {
    try {
      let url = `${this.baseUrl}/nasa/mars/${rover}/photos?sol=${sol}`;
      if (camera && camera !== 'all') {
        url += `&camera=${camera}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch Mars photos' }));
        throw new Error(errorData.message || 'Failed to fetch Mars photos');
      }

      return await response.json();
    } catch (error) {
      console.error('Mars Photos API Error:', error);
      throw error;
    }
  }

  // Near-Earth Objects
  static async getNEOData() {
    try {
      const response = await fetch(`${this.baseUrl}/nasa/neo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch NEO data' }));
        throw new Error(errorData.message || 'Failed to fetch NEO data');
      }

      return await response.json();
    } catch (error) {
      console.error('NEO API Error:', error);
      throw error;
    }
  }

  // EPIC Earth Imagery (Updated)
  static async getEPICImages(date?: string) {
    try {
      let url = `${this.baseUrl}/nasa/epic/images`;
      if (date) {
        url += `?date=${encodeURIComponent(date)}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`NASA API Error: 404 Not Found`);
        }
        const errorData = await response.json().catch(() => ({ message: 'Failed to fetch EPIC images' }));
        throw new Error(errorData.message || 'Failed to fetch EPIC images');
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length === 0) {
        throw new Error(`No EPIC images available for date ${date}`);
      }

      return data;
    } catch (error) {
      console.error('EPIC API Error:', error);
      throw error;
    }
  }

  static getEPICImageUrl(image: any) {
    return image.url || image.img_src || '';
  }

  // NASA Image and Video Library Search
  static async searchLibrary(query: string, mediaType = 'all', page = 1, pageSize = 20) {
    try {
      let url = `${this.baseUrl}/nasa/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
      if (mediaType !== 'all') {
        url += `&media_type=${mediaType}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to search NASA library' }));
        throw new Error(errorData.message || 'Failed to search NASA library');
      }

      return await response.json();
    } catch (error) {
      console.error('NASA Library Search API Error:', error);
      throw error;
    }
  }
}
