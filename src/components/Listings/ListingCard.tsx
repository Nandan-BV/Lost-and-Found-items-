import React from 'react';
import { MapPin, Calendar, User, Star, CheckCircle } from 'lucide-react';

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
    username: string;
    trust_score: number;
    successful_reunions: number;
  };
  listing_images: {
    image_url: string;
  }[];
};

type ListingCardProps = {
  listing: Listing;
  onMessage: (listing: Listing) => void;
};

export default function ListingCard({ listing, onMessage }: ListingCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const primaryImage = listing.listing_images?.[0]?.image_url || 
    'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative">
        <img
          src={primaryImage}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            listing.type === 'lost' 
              ? 'bg-red-500 text-white'
              : 'bg-green-500 text-white'
          }`}>
            {listing.type}
          </span>
        </div>

        {/* High Value Badge */}
        {listing.is_valuable && (
          <div className="absolute top-3 right-3">
            <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              High Value
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {listing.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
            <span>{formatDate(listing.date_lost_or_found)}</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-gray-600" />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-700">
                {listing.profiles?.username}
              </span>
              {listing.profiles?.successful_reunions > 0 && (
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-500 fill-current" />
                  <span className="text-xs text-green-600 ml-1">
                    {listing.profiles.successful_reunions}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => onMessage(listing)}
            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
}