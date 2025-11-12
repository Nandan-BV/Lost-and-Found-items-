import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ListingCard from './ListingCard';
import MessageModal from '../Messages/MessageModal';

type Listing = {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date_lost_or_found: string;
  is_valuable: boolean;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    trust_score: number;
    successful_reunions: number;
  };
  listing_images: {
    image_url: string;
  }[];
};

type BrowseListingsProps = {
  searchQuery: string;
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Items', color: 'bg-gray-100 text-gray-800' },
  { value: 'lost', label: 'Lost Items', color: 'bg-red-100 text-red-800' },
  { value: 'found', label: 'Found Items', color: 'bg-green-100 text-green-800' },
];

export default function BrowseListings({ searchQuery }: BrowseListingsProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, activeFilter, searchQuery]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles (
            id,
            username,
            trust_score,
            successful_reunions
          ),
          listing_images (
            image_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(listing => listing.type === activeFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query)
      );
    }

    setFilteredListings(filtered);
  };

  const handleMessage = (listing: Listing) => {
    setSelectedListing(listing);
    setShowMessageModal(true);
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
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === option.value
                  ? option.color
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} {filteredListings.length === 1 ? 'result' : 'results'}
            {searchQuery && (
              <span> for "{searchQuery}"</span>
            )}
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
                ? "Try adjusting your search terms or filters"
                : "Be the first to report a lost or found item!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onMessage={handleMessage}
              />
            ))}
          </div>
        )}
      </div>

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        listing={selectedListing}
      />
    </>
  );
}