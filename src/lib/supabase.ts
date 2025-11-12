import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          trust_score: number;
          successful_reunions: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          trust_score?: number;
          successful_reunions?: number;
        };
        Update: {
          username?: string;
          avatar_url?: string | null;
          trust_score?: number;
          successful_reunions?: number;
        };
      };
      listings: {
        Row: {
          id: string;
          user_id: string;
          type: 'lost' | 'found';
          title: string;
          description: string;
          category: string;
          location: string;
          date_lost_or_found: string;
          is_valuable: boolean;
          status: 'open' | 'closed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type: 'lost' | 'found';
          title: string;
          description: string;
          category: string;
          location: string;
          date_lost_or_found: string;
          is_valuable?: boolean;
          status?: 'open' | 'closed';
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          location?: string;
          date_lost_or_found?: string;
          is_valuable?: boolean;
          status?: 'open' | 'closed';
        };
      };
      listing_images: {
        Row: {
          id: string;
          listing_id: string;
          image_url: string;
          caption: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          listing_id: string;
          image_url: string;
          caption?: string;
          order_index?: number;
        };
        Update: {
          image_url?: string;
          caption?: string;
          order_index?: number;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          listing_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          sender_id: string;
          receiver_id: string;
          listing_id: string;
          content: string;
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
      };
    };
  };
};