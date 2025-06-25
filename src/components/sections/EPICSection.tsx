
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { useEPICImages } from '@/hooks/useNASAApi';

interface EPICImage {
  identifier: string;
  caption: string;
  image: string;
  date: string;
  url?: string;
  img_src?: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
  dscovr_j2000_position: {
    x: number;
    y: number;
    z: number;
  };
}

const EPICSection = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<EPICImage | null>(null);
  
  const { images, loading, error, refetch } = useEPICImages(selectedDate);

  const handleDateSearch = () => {
    if (selectedDate) {
      refetch(selectedDate);
    }
  };

  const resetToLatest = () => {
    setSelectedDate('');
    refetch();
  };

  const getImageUrl = (image: EPICImage) => {
    return image.url || image.img_src || '';
  };

  if (loading) {
    return <LoadingSpinner message="Capturing Earth from space..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => refetch(selectedDate)} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-orbitron text-3xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
          EPIC Earth Imagery
        </h2>
        <p className="text-muted-foreground">
          Earth Polychromatic Imaging Camera - Our planet from L1
        </p>
      </div>

      {/* Date Selector */}
      <Card className="space-card p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-cosmic-300">Select Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="bg-space-800 border-space-600"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDateSearch} className="cosmic-button" disabled={!selectedDate}>
              Search Date
            </Button>
            <Button onClick={resetToLatest} variant="outline" className="border-cosmic-500 text-cosmic-300">
              Latest Images
            </Button>
          </div>
        </div>
      </Card>

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card className="space-card p-8 text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-xl font-bold mb-2">No Images Available</h3>
          <p className="text-muted-foreground">
            No EPIC images found for the selected date. Try a different date or view the latest images.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">
              Found {images.length} image{images.length !== 1 ? 's' : ''} 
              {images[0] && ` from ${new Date(images[0].date).toLocaleDateString()}`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <Card key={image.identifier} className="space-card overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div 
                  className="relative"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={getImageUrl(image)}
                    alt={image.caption}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">{image.caption}</p>
                    <p className="text-white/80 text-xs">
                      {new Date(image.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-cosmic-300">Lat:</span>
                      <span className="text-muted-foreground">{image.centroid_coordinates?.lat?.toFixed(2) || 'N/A'}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cosmic-300">Lon:</span>
                      <span className="text-muted-foreground">{image.centroid_coordinates?.lon?.toFixed(2) || 'N/A'}°</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full bg-space-900 rounded-lg overflow-hidden">
            <img
              src={getImageUrl(selectedImage)}
              alt={selectedImage.caption}
              className="max-w-full max-h-[70vh] object-contain"
            />
            <div className="p-6 space-y-3">
              <h3 className="text-xl font-bold text-cosmic-300">{selectedImage.caption}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-cosmic-300">Date:</span>
                  <span className="ml-2 text-muted-foreground">
                    {new Date(selectedImage.date).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-cosmic-300">Identifier:</span>
                  <span className="ml-2 text-muted-foreground">{selectedImage.identifier}</span>
                </div>
                <div>
                  <span className="text-cosmic-300">Centroid:</span>
                  <span className="ml-2 text-muted-foreground">
                    {selectedImage.centroid_coordinates?.lat?.toFixed(2) || 'N/A'}°, {selectedImage.centroid_coordinates?.lon?.toFixed(2) || 'N/A'}°
                  </span>
                </div>
                {selectedImage.dscovr_j2000_position && (
                  <div>
                    <span className="text-cosmic-300">Distance:</span>
                    <span className="ml-2 text-muted-foreground">
                      {Math.sqrt(
                        selectedImage.dscovr_j2000_position.x ** 2 + 
                        selectedImage.dscovr_j2000_position.y ** 2 + 
                        selectedImage.dscovr_j2000_position.z ** 2
                      ).toFixed(0)} km
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
              size="sm"
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EPICSection;
