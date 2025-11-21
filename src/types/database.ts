export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          category_id: string;
          stock_quantity: number;
          status: string;
          length_cm: number | null;
          width_cm: number | null;
          height_cm: number | null;
          weight_kg: number | null;
          materials: string | null;
          mechanism_type: string | null;
          fabric_type: string | null;
          bed_size: string | null;
          door_count: number | null;
          source_url: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          display_order: number;
          created_at: string;
        };
      };
      product_tags: {
        Row: {
          id: string;
          product_id: string;
          tag_name: string;
          tag_type: string;
          created_at: string;
        };
      };
    };
  };
}
