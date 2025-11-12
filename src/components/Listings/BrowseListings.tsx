import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

type BrowseListingsProps = {
  searchQuery?: string;
  items?: any[];
  loading?: boolean;
};

export default function BrowseListings({ searchQuery = '', items = [], loading = false }: BrowseListingsProps) {
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    filterListings();
  }, [items, activeFilter, searchQuery]);

  const filterListings = () => {
    let filtered = items;

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    setFilteredListings(filtered);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setActiveFilter('lost')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'lost'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Lost Items
        </button>
        <button
          onClick={() => setActiveFilter('found')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === 'found'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Found Items
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No items match your search for "${searchQuery}". Try different keywords.`
              : 'No items have been listed yet. Be the first to report a lost or found item!'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Image */}
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.type === 'lost' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.type === 'lost' ? 'Lost' : 'Found'}
                  </span>
                  {item.isValuable && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      High Value
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="font-medium">Category:</span>
                    <span className="ml-2">{item.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{item.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400">
                    Listed by {item.userName} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
