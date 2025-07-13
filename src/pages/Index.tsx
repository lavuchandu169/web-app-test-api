
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import APODSection from '@/components/sections/APODSection';
import MarsSection from '@/components/sections/MarsSection';
import NEOSection from '@/components/sections/NEOSection';
import EPICSection from '@/components/sections/EPICSection';
import SearchSection from '@/components/sections/SearchSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('apod');

  const renderSection = () => {
    switch (activeSection) {
      case 'apod':
        return <APODSection />;
      case 'mars':
        return <MarsSection />;
      case 'neo':
        return <NEOSection />;
      case 'epic':
        return <EPICSection />;
      case 'search':
        return <SearchSection />;
      default:
        return <APODSection />;
    }
  };

  return (
    <div className="min-h-screen bg-space-gradient">
      {/* Stars background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cosmic-300 rounded-full animate-twinkle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-nebula-400 rounded-full animate-twinkle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-cosmic-400 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="font-orbitron text-4xl font-bold bg-cosmic-gradient bg-clip-text text-transparent animate-float">
              Space Voyager Hub
            </h1>
            <p className="text-muted-foreground mt-2">
              Explore the cosmos with NASA's data
            </p>
          </div>
          
          <div className="hidden lg:flex justify-between items-center">
            <div>
              <h1 className="font-orbitron text-4xl font-bold bg-cosmic-gradient bg-clip-text text-transparent animate-float">
                Space Voyager Hub
              </h1>
              <p className="text-muted-foreground mt-2">
                Explore the cosmos with NASA's data
              </p>
            </div>
            
            <Navigation 
              activeSection={activeSection} 
              onSectionChange={setActiveSection} 
            />
          </div>
        </header>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Navigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-8">
          {renderSection()}
        </main>

        {/* Footer */}
        <footer className="border-t border-space-700 mt-16">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-muted-foreground">
              Powered by NASA's Open Data APIs
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
