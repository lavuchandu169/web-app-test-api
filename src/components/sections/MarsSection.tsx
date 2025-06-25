import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { useMarsPhotos } from '@/hooks/useNASAApi';

interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  camera: {
    name: string;
    full_name: string;
  };
  rover: {
    name: string;
    status: string;
  };
}

const MarsSection = () => {
  const [sol, setSol] = useState('1000');
  const [rover, setRover] = useState('curiosity');
  const [camera, setCamera] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<MarsPhoto | null>(null);

  const { photos, loading, error, refetch } = useMarsPhotos(rover, sol, camera);

  const rovers = [
    { value: 'curiosity', label: 'Curiosity' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'spirit', label: 'Spirit' },
    { value: 'perseverance', label: 'Perseverance' },
    { value: 'ingenuity', label: 'Ingenuity' }
  ];

  const cameras = [
    { value: 'all', label: 'All Cameras' },
    { value: 'fhaz', label: 'Front Hazard Avoidance Camera' },
    { value: 'rhaz', label: 'Rear Hazard Avoidance Camera' },
    { value: 'mast', label: 'Mast Camera' },
    { value: 'chemcam', label: 'Chemistry and Camera Complex' },
    { value: 'mahli', label: 'Mars Hand Lens Imager' },
    { value: 'mardi', label: 'Mars Descent Imager' },
    { value: 'navcam', label: 'Navigation Camera' }
  ];

  if (loading) {
    return <LoadingSpinner message="Retrieving Mars rover data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-orbitron text-3xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
          Mars Rover Gallery
        </h2>
        <p className="text-muted-foreground">Explore the Red Planet through rover cameras</p>
      </div>

      {/* Filters */}
      <Card className="space-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cosmic-300">Sol (Martian Day)</label>
            <Input
              type="number"
              value={sol}
              onChange={(e) => setSol(e.target.value)}
              placeholder="Enter sol number"
              className="bg-space-800 border-space-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-cosmic-300">Rover</label>
            <Select value={rover} onValueChange={setRover}>
              <SelectTrigger className="bg-space-800 border-space-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-space-800 border-space-600">
                {rovers.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-cosmic-300">Camera</label>
            <Select value={camera} onValueChange={setCamera}>
              <SelectTrigger className="bg-space-800 border-space-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-space-800 border-space-600">
                {cameras.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button onClick={refetch} className="cosmic-button w-full">
              Search Photos
            </Button>
          </div>
        </div>
      </Card>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <Card className="space-card p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">No Photos Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search parameters. Some sols or camera combinations may not have available photos.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="space-card overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
              <div 
                className="relative"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img
                  src={photo.img_src}
                  alt={`Mars photo by ${photo.rover.name}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">{photo.camera.name}</p>
                  <p className="text-white/80 text-xs">{photo.earth_date}</p>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cosmic-300 font-medium">{photo.rover.name}</span>
                  <span className="text-muted-foreground">{photo.camera.name}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full bg-space-900 rounded-lg overflow-hidden">
            <img
              src={selectedPhoto.img_src}
              alt={`Mars photo by ${selectedPhoto.rover.name}`}
              className="max-w-full max-h-[70vh] object-contain"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-xl font-bold text-cosmic-300">
                {selectedPhoto.rover.name} - {selectedPhoto.camera.full_name}
              </h3>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Earth Date: {selectedPhoto.earth_date}</span>
                <span>Photo ID: {selectedPhoto.id}</span>
              </div>
            </div>
            <Button
              onClick={() => setSelectedPhoto(null)}
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

export default MarsSection;
