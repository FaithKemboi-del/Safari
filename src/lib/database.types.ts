export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type TableDef<Row, Insert = Row, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      destinations: TableDef<{
          id: string;
          slug: string;
          title: string;
          location: string;
          region: string;
          experience_type: 'hike' | 'standard';
          description: string;
          pricing: string | null;
          safety_and_conditions: string | null;
          transport_and_logistics: string | null;
          additional_info: string | null;
          hike_difficulty: string | null;
          image: string;
          gallery: string[];
          highlights: string[];
          map_query: string;
          status: 'published' | 'draft' | 'review';
          created_at: string;
          updated_at: string;
        }>;
      itineraries: TableDef<{
          id: string;
          title: string;
          duration: string;
          route: string;
          price: string;
          style: string;
          image: string;
          status: 'live' | 'review' | 'draft';
          created_at: string;
          updated_at: string;
        }>;
      itinerary_days: TableDef<{
          id: string;
          itinerary_id: string;
          day_order: number;
          day_label: string;
          title: string;
          details: string;
        }>;
      community_updates: TableDef<
        {
          id: string;
          destination_slug: string;
          user_id: string | null;
          author_name: string;
          comment: string;
          is_on_ground: boolean;
          created_at: string;
        },
        {
          destination_slug: string;
          user_id: string | null;
          author_name: string;
          comment: string;
          is_on_ground: boolean;
          id?: string;
          created_at?: string;
        }
      >;
      profiles: TableDef<{
          id: string;
          full_name: string | null;
          avatar_initials: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        }>;
      routes: TableDef<{
          id: string;
          name: string;
          route_type: string;
          distance: string;
          status: 'active' | 'draft';
          created_at: string;
          updated_at: string;
        }>;
      category_spots: TableDef<{
          id: string;
          category_id: string;
          title: string;
          location: string;
          budget: string;
          description: string;
          image: string;
          slug: string | null;
          trail_id: string | null;
          map_query: string | null;
          date_label: string | null;
          event_status: 'happening-now' | 'upcoming' | 'past' | null;
          status: 'published' | 'draft' | 'review';
          sort_order: number;
          created_at: string;
          updated_at: string;
        }>;
      trails: TableDef<
        {
          id: string;
          slug: string;
          title: string;
          location: string;
          difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
          difficulty_label: string;
          duration: string;
          distance_km: number;
          elevation_gain_m: number;
          budget: string;
          description: string;
          image: string;
          map_query: string;
          google_maps_url: string;
          destination_slug: string | null;
          route_type: 'loop' | 'out-and-back' | 'point-to-point';
          coordinates: Json;
          waypoints: Json;
          elevation_profile: Json;
          tips: string[];
          status: 'published' | 'draft';
          created_by_user_id: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          slug: string;
          title: string;
          location: string;
          difficulty: 'easy' | 'moderate' | 'hard' | 'expert';
          difficulty_label: string;
          duration: string;
          distance_km: number;
          elevation_gain_m: number;
          budget: string;
          description: string;
          image: string;
          map_query: string;
          google_maps_url: string;
          destination_slug?: string | null;
          route_type: 'loop' | 'out-and-back' | 'point-to-point';
          coordinates: Json;
          waypoints: Json;
          elevation_profile: Json;
          tips?: string[];
          status?: 'published' | 'draft';
          created_by_user_id?: string | null;
        }
      >;
      trail_reviews: TableDef<
        {
          id: string;
          trail_id: string;
          user_id: string | null;
          author_name: string;
          rating: number;
          comment: string;
          created_at: string;
        },
        {
          trail_id: string;
          user_id: string | null;
          author_name: string;
          rating: number;
          comment: string;
        }
      >;
      hike_tracks: TableDef<
        {
          id: string;
          trail_id: string | null;
          user_id: string | null;
          trail_name: string;
          track_points: Json;
          distance_km: number;
          started_at: string;
          ended_at: string | null;
          notes: string | null;
          created_at: string;
        },
        {
          trail_id?: string | null;
          user_id?: string | null;
          trail_name: string;
          track_points: Json;
          distance_km: number;
          started_at: string;
          ended_at?: string | null;
          notes?: string | null;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
