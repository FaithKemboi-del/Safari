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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
