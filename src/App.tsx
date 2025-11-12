import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import HeroPage from './components/Home/HeroPage';
import BrowseListings from './components/Listings/BrowseListings';
import ItemFormModal from './components/ItemForm/ItemFormModal';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'browse'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemForm, setShowItemForm] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('browse');
    }
  };

  const handleShowItemForm = () => {
    setShowItemForm(true);
  };

  const handleItemFormSubmit = () => {
    // Refresh listings after successful submission
    setCurrentView('browse');
    setSearchQuery('');
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    setSearchQuery('');
  };

  const handleBrowseListings = () => {
    setCurrentView('browse');
    setSearchQuery('');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={handleSearch}
          onShowItemForm={handleShowItemForm}
          onNavigateHome={handleNavigateHome}
          currentView={currentView}
        />

        <main>
          {currentView === 'home' ? (
            <HeroPage 
              onShowItemForm={handleShowItemForm}
              onBrowseListings={handleBrowseListings}
            />
          ) : (
            <BrowseListings searchQuery={searchQuery} />
          )}
        </main>

        <ItemFormModal
          isOpen={showItemForm}
          onClose={() => setShowItemForm(false)}
          onSubmit={handleItemFormSubmit}
        />
      </div>
    </AuthProvider>
  );
}

export default App;