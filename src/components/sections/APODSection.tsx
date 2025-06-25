
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { useAPOD } from '@/hooks/useNASAApi';

const APODSection = () => {
  const { data: apodData, loading, error, refetch } = useAPOD();
  const [showFullImage, setShowFullImage] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Fetching today's cosmic wonder..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (!apodData) {
    return <ErrorMessage message="No astronomy picture data available" />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-orbitron text-3xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
          Astronomy Picture of the Day
        </h2>
        <p className="text-muted-foreground">NASA's daily cosmic revelation</p>
      </div>

      <Card className="space-card overflow-hidden">
        {apodData.media_type === 'video' ? (
          <div className="aspect-video">
            <iframe
              src={apodData.url}
              className="w-full h-full"
              allowFullScreen
              title={apodData.title}
            />
          </div>
        ) : (
          <div className="relative group">
            <img
              src={apodData.url}
              alt={apodData.title}
              className="w-full h-96 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setShowFullImage(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-cosmic-300">{apodData.title}</h3>
            <span className="text-sm text-muted-foreground bg-space-800 px-3 py-1 rounded-full">
              {apodData.date}
            </span>
          </div>
          
          <p className="text-foreground leading-relaxed">{apodData.explanation}</p>
          
          {apodData.copyright && (
            <p className="text-sm text-muted-foreground">
              © {apodData.copyright}
            </p>
          )}
          
          {apodData.hdurl && apodData.media_type === 'image' && (
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowFullImage(true)}
                className="cosmic-button"
              >
                View Full Resolution
              </Button>
              <Button 
                onClick={() => window.open(apodData.hdurl, '_blank')}
                variant="outline"
                className="border-cosmic-500 text-cosmic-300 hover:bg-cosmic-500/10"
              >
                Download HD
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Full Image Modal */}
      {showFullImage && apodData.hdurl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={apodData.hdurl}
              alt={apodData.title}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              onClick={() => setShowFullImage(false)}
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

export default APODSection;
