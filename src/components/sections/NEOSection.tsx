
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import { useNEOData } from '@/hooks/useNASAApi';

interface NEOObject {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
}

const NEOSection = () => {
  const { data: neoData, loading, error, refetch } = useNEOData();
  const [selectedNEO, setSelectedNEO] = useState<NEOObject | null>(null);

  if (loading) {
    return <LoadingSpinner message="Scanning for near-Earth objects..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  if (!neoData) {
    return <ErrorMessage message="No NEO data available" />;
  }

  // Process data for charts - properly type the flattened array
  const allNEOs = Object.values(neoData.near_earth_objects).flat() as NEOObject[];
  const hazardousCount = allNEOs.filter(neo => neo.is_potentially_hazardous_asteroid).length;
  const safeCount = allNEOs.length - hazardousCount;

  const hazardData = [
    { name: 'Safe', value: safeCount, color: '#10b981' },
    { name: 'Potentially Hazardous', value: hazardousCount, color: '#ef4444' }
  ];

  const dailyData = Object.entries(neoData.near_earth_objects).map(([date, neos]) => ({
    date: new Date(date).toLocaleDateString(),
    count: (neos as NEOObject[]).length,
    hazardous: (neos as NEOObject[]).filter(neo => neo.is_potentially_hazardous_asteroid).length
  }));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-orbitron text-3xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
          Near-Earth Objects
        </h2>
        <p className="text-muted-foreground">
          Tracking cosmic neighbors in the next 7 days
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="space-card p-6 text-center">
          <div className="text-3xl font-bold text-nebula-400">{neoData.element_count}</div>
          <div className="text-sm text-muted-foreground">Total NEOs</div>
        </Card>
        <Card className="space-card p-6 text-center">
          <div className="text-3xl font-bold text-green-400">{safeCount}</div>
          <div className="text-sm text-muted-foreground">Safe Objects</div>
        </Card>
        <Card className="space-card p-6 text-center">
          <div className="text-3xl font-bold text-red-400">{hazardousCount}</div>
          <div className="text-sm text-muted-foreground">Potentially Hazardous</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-card p-6">
          <h3 className="text-xl font-bold mb-4 text-cosmic-300">Daily NEO Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" />
              <Bar dataKey="hazardous" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="space-card p-6">
          <h3 className="text-xl font-bold mb-4 text-cosmic-300">Hazard Assessment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={hazardData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {hazardData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* NEO List */}
      <Card className="space-card">
        <div className="p-6 border-b border-space-700">
          <h3 className="text-xl font-bold text-cosmic-300">Near-Earth Objects Details</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {allNEOs.slice(0, 10).map((neo) => (
            <div 
              key={neo.id}
              className="p-4 border-b border-space-700 hover:bg-space-800/50 cursor-pointer transition-colors"
              onClick={() => setSelectedNEO(neo)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-cosmic-300">{neo.name}</h4>
                    {neo.is_potentially_hazardous_asteroid && (
                      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                        ⚠️ Hazardous
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Diameter: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
                  </div>
                  {neo.close_approach_data[0] && (
                    <div className="text-sm text-muted-foreground">
                      Closest approach: {neo.close_approach_data[0].close_approach_date}
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="border-cosmic-500 text-cosmic-300">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* NEO Details Modal */}
      {selectedNEO && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedNEO(null)}
        >
          <Card className="space-card p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-cosmic-300">{selectedNEO.name}</h3>
              <Button
                onClick={() => setSelectedNEO(null)}
                variant="outline"
                size="sm"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-cosmic-300 mb-2">Estimated Diameter</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedNEO.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} - {selectedNEO.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} kilometers
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-cosmic-300 mb-2">Hazard Assessment</h4>
                <p className={`text-sm ${selectedNEO.is_potentially_hazardous_asteroid ? 'text-red-400' : 'text-green-400'}`}>
                  {selectedNEO.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Not Hazardous'}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-cosmic-300 mb-2">Close Approach Data</h4>
                {selectedNEO.close_approach_data.map((approach, index) => (
                  <div key={index} className="text-sm text-muted-foreground mb-2 p-3 bg-space-800/50 rounded">
                    <p>Date: {approach.close_approach_date}</p>
                    <p>Velocity: {parseFloat(approach.relative_velocity.kilometers_per_hour).toLocaleString()} km/h</p>
                    <p>Miss Distance: {parseFloat(approach.miss_distance.kilometers).toLocaleString()} km</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NEOSection;
