
// Custom hooks for NASA API data fetching
import { useState, useEffect } from 'react';
import { NASAApiService } from '../services/api/nasaApi';

export const useAPOD = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAPOD = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await NASAApiService.getAPOD();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  return { data, loading, error, refetch: fetchAPOD };
};

export const useMarsPhotos = (rover: string, sol: string, camera: string) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await NASAApiService.getMarsPhotos(rover, sol, camera);
      setPhotos(result.photos.slice(0, 20));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [rover, sol, camera]);

  return { photos, loading, error, refetch: fetchPhotos };
};

export const useNEOData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNEOData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await NASAApiService.getNEOData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNEOData();
  }, []);

  return { data, loading, error, refetch: fetchNEOData };
};

export const useEPICImages = (selectedDate?: string) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async (date?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await NASAApiService.getEPICImages(date);
      setImages(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(selectedDate);
  }, [selectedDate]);

  return { images, loading, error, refetch: fetchImages };
};

export const useNASALibrarySearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalHits, setTotalHits] = useState(0);

  const search = async (query: string, mediaType = 'all', page = 1, pageSize = 20) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await NASAApiService.searchLibrary(query, mediaType, page, pageSize);
      setResults(result.collection.items);
      setTotalHits(result.collection.metadata.total_hits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, totalHits, search };
};
