import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import HeroPage from './components/Home/HeroPage';
import BrowseListings from './components/Listings/BrowseListings';
import ItemFormModal from './components/ItemForm/ItemFormModal';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemForm, setShowItemForm] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Determine currentView from the URL path
  const currentView = location.pathname === '/' ? 'home' : 'browse';

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('lostFoundItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    navigate('/browse');
  };

  const handleShowItemForm = () => setShowItemForm(true);
  
  const handleItemFormSubmit = (newItem: any) => {
    console.log('New item created in App:', newItem);
    
    // Save to localStorage with size check
    const existingItems = JSON.parse(localStorage.getItem('lostFoundItems') || '[]');
    const updatedItems = [newItem, ...existingItems];
    
    // Limit to last 10 items to prevent storage overflow
    const limitedItems = updatedItems.slice(0, 10);
    
    try {
      localStorage.setItem('lostFoundItems', JSON.stringify(limitedItems));
      setItems(limitedItems);
    } catch (error) {
      // If still too big, clear and start fresh
      localStorage.removeItem('lostFoundItems');
      localStorage.setItem('lostFoundItems', JSON.stringify([newItem]));
      setItems([newItem]);
    }
    
    setShowItemForm(false);
    navigate('/browse');
  };

  const handleCloseItemForm = () => {
    setShowItemForm(false);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          onSearch={handleSearch}
          onShowItemForm={handleShowItemForm}
          onNavigateHome={() => navigate('/')}
          currentView={currentView}
        />

        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <HeroPage 
                  onShowItemForm={handleShowItemForm} 
                  onBrowseListings={() => navigate('/browse')} 
                  items={items}
                />
              } 
            />
            <Route 
              path="/browse" 
              element={
                <BrowseListings 
                  searchQuery={searchQuery} 
                  items={items}
                  loading={loading}
                />
              } 
            />
          </Routes>
        </main>

        <ItemFormModal
          isOpen={showItemForm}
          onClose={handleCloseItemForm}
          onSubmit={handleItemFormSubmit}
        />
      </div>
    </AuthProvider>
  );
}

export default App;