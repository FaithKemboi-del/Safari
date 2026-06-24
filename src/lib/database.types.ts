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
          category: string | null;
          description: string;
          county: string | null;
          nearest_town: string | null;
          distance_from_nairobi_km: number | null;
          travel_time_from_nairobi: string | null;
          best_time_to_visit: string | null;
          budget_transport: number;
          budget_accommodation: number;
          budget_entry_fee: number;
          budget_guide_fee: number;
          budget_food: number;
          budget_activity: number;
          directions: string | null;
          road_conditions: string | null;
          public_transport: string | null;
          what_to_carry: string | null;
          travel_tips: string | null;
          family_friendly: boolean;
          category_fields: Record<string, unknown>;
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
          featured_on_home: boolean;
          featured_sort_order: number;
          trending_on_home: boolean;
          trending_tag: string | null;
          trending_searches: string | null;
          trending_sort_order: number;
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
          featured_on_home: boolean;
          featured_sort_order: number;
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
      community_posts: TableDef<{
          id: string;
          user_id: string | null;
          author_name: string;
          message: string;
          kind: 'question' | 'trip-report' | 'tip';
          destination_slug: string | null;
          itinerary_id: string | null;
          is_pinned: boolean;
          status: 'published' | 'hidden';
          created_at: string;
          updated_at: string;
        }>;
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
      spot_inquiries: TableDef<{
          id: string;
          spot_id: string;
          spot_title: string;
          category_id: string;
          user_id: string | null;
          author_name: string;
          message: string;
          status: 'published' | 'hidden';
          admin_seen: boolean;
          created_at: string;
          updated_at: string;
        }>;
      spot_inquiry_replies: TableDef<{
          id: string;
          inquiry_id: string;
          user_id: string | null;
          author_name: string;
          message: string;
          created_at: string;
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
