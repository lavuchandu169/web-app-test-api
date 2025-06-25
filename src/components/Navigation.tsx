
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: 'apod', name: 'Astronomy Picture', icon: '🌟' },
    { id: 'mars', name: 'Mars Rovers', icon: '🚀' },
    { id: 'neo', name: 'Near-Earth Objects', icon: '☄️' },
    { id: 'epic', name: 'Earth Imagery', icon: '🌍' },
    { id: 'search', name: 'NASA Library', icon: '📡' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="cosmic-button p-2"
        >
          <span className="text-xl">☰</span>
        </Button>
      </div>

      {/* Navigation */}
      <Card className={`
        fixed lg:relative top-0 left-0 h-full lg:h-auto w-64 lg:w-auto 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 z-40 lg:z-auto
        space-card p-6 lg:p-4
      `}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Header */}
          <div className="lg:hidden mb-6">
            <h1 className="font-orbitron text-2xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
              Space Voyager Hub
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Explore the cosmos with NASA
            </p>
          </div>

          {/* Navigation Items */}
          <div className="flex flex-col lg:flex-row gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  setIsOpen(false);
                }}
                variant={activeSection === section.id ? "default" : "outline"}
                className={`
                  justify-start lg:justify-center gap-3 p-3 lg:p-2
                  ${activeSection === section.id 
                    ? 'cosmic-button' 
                    : 'hover:bg-space-700/50 border-space-600'
                  }
                `}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
