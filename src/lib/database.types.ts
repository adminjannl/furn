export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          display_order?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          description: string | null
          price: number
          discount_percentage: number
          sku: string
          length_cm: number | null
          width_cm: number | null
          height_cm: number | null
          weight_kg: number | null
          materials: string | null
          stock_quantity: number
          status: 'active' | 'inactive'
          variant_group: string | null
          is_master_variant: boolean
          source_url: string | null
          source_name_russian: string | null
          last_scraped_at: string | null
          scrape_status: string | null
          scrape_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          description?: string | null
          price: number
          discount_percentage?: number
          sku: string
          length_cm?: number | null
          width_cm?: number | null
          height_cm?: number | null
          weight_kg?: number | null
          materials?: string | null
          stock_quantity?: number
          status?: 'active' | 'inactive'
          variant_group?: string | null
          is_master_variant?: boolean
          source_url?: string | null
          source_name_russian?: string | null
          last_scraped_at?: string | null
          scrape_status?: string | null
          scrape_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          slug?: string
          description?: string | null
          price?: number
          discount_percentage?: number
          sku?: string
          length_cm?: number | null
          width_cm?: number | null
          height_cm?: number | null
          weight_kg?: number | null
          materials?: string | null
          stock_quantity?: number
          status?: 'active' | 'inactive'
          variant_group?: string | null
          is_master_variant?: boolean
          source_url?: string | null
          source_name_russian?: string | null
          last_scraped_at?: string | null
          scrape_status?: string | null
          scrape_error?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          display_order: number
          alt_text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          display_order?: number
          alt_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          display_order?: number
          alt_text?: string | null
          created_at?: string
        }
      }
      product_colors: {
        Row: {
          id: string
          product_id: string
          color_name: string
          color_code: string | null
          variant_slug: string | null
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          color_name: string
          color_code?: string | null
          variant_slug?: string | null
          is_current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          color_name?: string
          color_code?: string | null
          variant_slug?: string | null
          is_current?: boolean
          created_at?: string
        }
      }
      product_tags: {
        Row: {
          id: string
          product_id: string
          tag_type: string
          tag_value: string
          tag_value_russian: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          tag_type: string
          tag_value: string
          tag_value_russian?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          tag_type?: string
          tag_value?: string
          tag_value_russian?: string | null
          display_order?: number
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shipping_addresses: {
        Row: {
          id: string
          user_id: string
          full_name: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code: string
          country?: string
          phone: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string
          is_default?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          shipping_address_id: string | null
          subtotal: number
          tax: number
          shipping_cost: number
          total: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_intent_id: string | null
          payment_status: 'pending' | 'paid' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          shipping_address_id?: string | null
          subtotal: number
          tax?: number
          shipping_cost?: number
          total: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'paid' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          shipping_address_id?: string | null
          subtotal?: number
          tax?: number
          shipping_cost?: number
          total?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'paid' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string
          quantity: number
          unit_price: number
          total_price: number
          selected_color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku: string
          quantity: number
          unit_price: number
          total_price: number
          selected_color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          selected_color?: string | null
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          selected_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          selected_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          selected_color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hero_slides: {
        Row: {
          id: string
          title: string
          subtitle: string
          description: string
          background_image_url: string
          cta_primary_text: string
          cta_primary_link: string
          cta_secondary_text: string
          cta_secondary_link: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string
          description?: string
          background_image_url: string
          cta_primary_text?: string
          cta_primary_link?: string
          cta_secondary_text?: string
          cta_secondary_link?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          subtitle?: string
          description?: string
          background_image_url?: string
          cta_primary_text?: string
          cta_primary_link?: string
          cta_secondary_text?: string
          cta_secondary_link?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      hero_features: {
        Row: {
          id: string
          icon_name: string
          icon_color: string
          title: string
          description: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon_name: string
          icon_color?: string
          title: string
          description: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon_name?: string
          icon_color?: string
          title?: string
          description?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      craftsmanship_highlights: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          display_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          display_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          order_id: string | null
          order_number: string | null
          user_id: string | null
          reviewer_name: string
          reviewer_email: string | null
          rating: number
          title: string | null
          review_text: string
          is_verified_purchase: boolean
          is_approved: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          order_id?: string | null
          order_number?: string | null
          user_id?: string | null
          reviewer_name: string
          reviewer_email?: string | null
          rating: number
          title?: string | null
          review_text: string
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          order_id?: string | null
          order_number?: string | null
          user_id?: string | null
          reviewer_name?: string
          reviewer_email?: string | null
          rating?: number
          title?: string | null
          review_text?: string
          is_verified_purchase?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      review_helpful: {
        Row: {
          id: string
          review_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}
