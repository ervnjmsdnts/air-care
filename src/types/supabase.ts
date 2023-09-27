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
      audits: {
        Row: {
          created_at: string
          id: number
          label: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          label: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          label?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "audits_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          address: string
          created_at: string
          email: string
          id: number
          name: string
          password: string
          phone_number: string
          role: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          id?: number
          name: string
          password: string
          phone_number: string
          role?: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: number
          name?: string
          password?: string
          phone_number?: string
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
