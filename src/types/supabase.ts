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
      bookings: {
        Row: {
          created_at: string
          customer_name: string
          date: string
          email: string
          guests: number
          id: string
          phone: string | null
          special_requests: string | null
          status: string
          table_id: string | null
          time: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          date: string
          email: string
          guests: number
          id?: string
          phone?: string | null
          special_requests?: string | null
          status?: string
          table_id: string | null
          time: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          date?: string
          email?: string
          guests?: number
          id?: string
          phone?: string | null
          special_requests?: string | null
          status?: string
          table_id?: string | null
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_table_id_fkey"
            columns: ["table_id"]
            referencedRelation: "tables"
            referencedColumns: ["id"]
          }
        ]
      }
      menu_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          location: string
          number: number
          status: string
        }
        Insert: {
          capacity: number
          created_at?: string
          id?: string
          location: string
          number: number
          status?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          location?: string
          number?: number
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_booking: {
        Args: {
          p_table_id: string
          p_customer_name: string
          p_email: string
          p_phone?: string | null
          p_guests: number
          p_date: string
          p_time: string
          p_special_requests?: string | null
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
