
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { useNASALibrarySearch } from '@/hooks/useNASAApi';

interface SearchItem {
  href: string;
  data: Array<{
    nasa_id: string;
    title: string;
    description: string;
    date_created: string;
    media_type: string;
    keywords?: string[];
    center?: string;
  }>;
  links?: Array<{
    href: string;
    rel: string;
    render?: string;
  }>;
}

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);

  const { results: searchResults, loading, error, totalHits, search } = useNASALibrarySearch();

  const pageSize = 20;

  const handleSearch = () => {
    setCurrentPage(1);
    search(query, mediaType, 1, pageSize);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    search(query, mediaType, page, pageSize);
  };

  const getPreviewImage = (item: SearchItem) => {
    return item.links?.find(link => link.rel === 'preview')?.href || '/placeholder.svg';
  };

  const getThumbnail = (item: SearchItem) => {
    return item.links?.find(link => link.rel === 'preview')?.href || '/placeholder.svg';
  };

  const totalPages = Math.ceil(totalHits / pageSize);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-orbitron text-3xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
          NASA Image & Video Library
        </h2>
        <p className="text-muted-foreground">
          Explore NASA's vast collection of space imagery and videos
        </p>
      </div>

      {/* Search Controls */}
      <Card className="space-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for space images, videos, and audio..."
              className="bg-space-800 border-space-600"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger className="bg-space-800 border-space-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-space-800 border-space-600">
                <SelectItem value="all">All Media</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleSearch} className="cosmic-button" disabled={!query.trim()}>
            Search
          </Button>
        </div>
      </Card>

      {loading && <LoadingSpinner message="Searching NASA's archives..." />}

      {error && <ErrorMessage message={error} onRetry={handleSearch} />}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Found {totalHits.toLocaleString()} results for "{query}"
            </p>
            <p className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.map((item, index) => (
              <Card key={`${item.data[0].nasa_id}-${index}`} className="space-card overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div 
                  className="relative"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.data[0].media_type === 'video' ? (
                    <div className="relative">
                      <img
                        src={getThumbnail(item)}
                        alt={item.data[0].title}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-12 h-12 bg-cosmic-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">▶</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getPreviewImage(item)}
                      alt={item.data[0].title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium line-clamp-2">{item.data[0].title}</p>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <span className="bg-cosmic-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.data[0].media_type}
                    </span>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium text-cosmic-300 line-clamp-1 mb-1">
                    {item.data[0].title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {item.data[0].description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{new Date(item.data[0].date_created).toLocaleDateString()}</span>
                    {item.data[0].center && <span>{item.data[0].center}</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                className="border-cosmic-500 text-cosmic-300"
              >
                Previous
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={currentPage === pageNum ? "cosmic-button" : "border-cosmic-500 text-cosmic-300"}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                className="border-cosmic-500 text-cosmic-300"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && searchResults.length === 0 && query && !error && (
        <Card className="space-card p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">No Results Found</h3>
          <p className="text-muted-foreground">
            Try different keywords or check your spelling.
          </p>
        </Card>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <Card className="space-card p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-cosmic-300 flex-1 pr-4">
                {selectedItem.data[0].title}
              </h3>
              <Button
                onClick={() => setSelectedItem(null)}
                variant="outline"
                size="sm"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-center">
                {selectedItem.data[0].media_type === 'video' ? (
                  <img
                    src={getThumbnail(selectedItem)}
                    alt={selectedItem.data[0].title}
                    className="max-w-full max-h-96 object-contain rounded"
                  />
                ) : (
                  <img
                    src={getPreviewImage(selectedItem)}
                    alt={selectedItem.data[0].title}
                    className="max-w-full max-h-96 object-contain rounded"
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-cosmic-300 font-medium">NASA ID:</span>
                  <span className="ml-2 text-muted-foreground">{selectedItem.data[0].nasa_id}</span>
                </div>
                <div>
                  <span className="text-cosmic-300 font-medium">Date Created:</span>
                  <span className="ml-2 text-muted-foreground">
                    {new Date(selectedItem.data[0].date_created).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-cosmic-300 font-medium">Media Type:</span>
                  <span className="ml-2 text-muted-foreground">{selectedItem.data[0].media_type}</span>
                </div>
                {selectedItem.data[0].center && (
                  <div>
                    <span className="text-cosmic-300 font-medium">Center:</span>
                    <span className="ml-2 text-muted-foreground">{selectedItem.data[0].center}</span>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-cosmic-300 font-medium mb-2">Description</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedItem.data[0].description}
                </p>
              </div>
              
              {selectedItem.data[0].keywords && selectedItem.data[0].keywords.length > 0 && (
                <div>
                  <h4 className="text-cosmic-300 font-medium mb-2">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.data[0].keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="bg-cosmic-500/20 text-cosmic-300 px-2 py-1 rounded-full text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
