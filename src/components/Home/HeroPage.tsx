import React, { useState, useEffect } from 'react';
import { Search, MapPin, MessageCircle, CheckCircle, Heart, Star, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type RecentListing = {
  id: string;
  type: 'lost' | 'found';
  title: string;
  location: string;
  created_at: string;
  listing_images: {
    image_url: string;
  }[];
};

type HeroPageProps = {
  onShowItemForm: () => void;
  onBrowseListings: () => void;
};

const HOW_IT_WORKS_STEPS = [
  {
    icon: Search,
    title: 'Report',
    description: 'Post details about your lost or found item with photos and description.',
  },
  {
    icon: MessageCircle,
    title: 'Connect',
    description: 'Message other users safely through our secure platform.',
  },
  {
    icon: CheckCircle,
    title: 'Reunite',
    description: 'Arrange a safe meetup and reunite items with their owners.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Rakshitha',
    text: 'Found my lost wedding ring thanks to this amazing community! The person who found it was so kind.',
    reunions: 3,
  },
  {
    name: 'Sachi',
    text: 'I\'ve helped return 5 lost items to their owners. It feels great to help people in my community.',
    reunions: 5,
  },
  {
    name: 'Nandan',
    text: 'My laptop was returned within 24 hours of posting. The trust system really works!',
    reunions: 4,
  },
];

export default function HeroPage({ onShowItemForm, onBrowseListings }: HeroPageProps) {
  const [recentListings, setRecentListings] = useState<RecentListing[]>([]);

  useEffect(() => {
    fetchRecentListings();
  }, []);

  const fetchRecentListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          type,
          title,
          location,
          created_at,
          listing_images (image_url)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecentListings(data || []);
    } catch (error) {
      console.error('Error fetching recent listings:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Lost Something?{' '}
              <span className="text-blue-600">Found an Item?</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Reconnect what's lost with its owner, simply and securely. 
              Join our trusted community of helpers making a difference every day.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
              <button
                onClick={() => onShowItemForm()}
                className="px-8 py-3 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Report Lost Item
              </button>
              <button
                onClick={() => onShowItemForm()}
                className="px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Report Found Item
              </button>
            </div>

            <button
              onClick={onBrowseListings}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Browse all listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Recent Lost & Found Items
          </h2>
          
          {recentListings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No items posted yet. Be the first to help your community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentListings.map(listing => (
                <div
                  key={listing.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={onBrowseListings}
                >
                  <div className="relative">
                    <img
                      src={listing.listing_images?.[0]?.image_url || 
                        'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={listing.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                        listing.type === 'lost' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {listing.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{listing.location}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTimeAgo(listing.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to reunite lost items with their owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stories from Our Community
            </h2>
            <p className="text-xl text-gray-600">
              Real people helping real people every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-green-500 fill-current" />
                      <span className="text-sm text-green-600 ml-1">
                        {testimonial.reunions} successful reunions
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of community members helping reunite lost items with their owners
            </p>
            <button
              onClick={() => onShowItemForm()}
              className="px-8 py-3 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}