export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json
          resource_id: string
          resource_type: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json
          resource_id: string
          resource_type: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json
          resource_id?: string
          resource_type?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      document_comments: {
        Row: {
          content: string
          created_at: string
          document_id: string
          id: string
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          document_id: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          document_id?: string
          id?: string
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_comments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "document_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      document_shares: {
        Row: {
          access_level: string
          created_at: string
          document_id: string
          expires_at: string | null
          id: string
          shared_by: string
          shared_with: string
        }
        Insert: {
          access_level?: string
          created_at?: string
          document_id: string
          expires_at?: string | null
          id?: string
          shared_by: string
          shared_with: string
        }
        Update: {
          access_level?: string
          created_at?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          shared_by?: string
          shared_with?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          created_at: string
          document_id: string
          email: string
          id: string
          page_number: number | null
          position_x: number | null
          position_y: number | null
          signature_data: Json | null
          signed_at: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          document_id: string
          email: string
          id?: string
          page_number?: number | null
          position_x?: number | null
          position_y?: number | null
          signature_data?: Json | null
          signed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          document_id?: string
          email?: string
          id?: string
          page_number?: number | null
          position_x?: number | null
          position_y?: number | null
          signature_data?: Json | null
          signed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          content: string | null
          created_at: string
          created_by: string
          document_id: string
          file_path: string | null
          id: string
          metadata: Json | null
          version_number: number
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by: string
          document_id: string
          file_path?: string | null
          id?: string
          metadata?: Json | null
          version_number: number
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string
          document_id?: string
          file_path?: string | null
          id?: string
          metadata?: Json | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          collaborators: Json | null
          content: string | null
          created_at: string
          description: string | null
          document_type: string
          extracted_fields: Json
          file_path: string
          id: string
          metadata: Json
          preview_url: string | null
          risk_level: string
          status: string
          team_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collaborators?: Json | null
          content?: string | null
          created_at?: string
          description?: string | null
          document_type?: string
          extracted_fields?: Json
          file_path: string
          id?: string
          metadata?: Json
          preview_url?: string | null
          risk_level?: string
          status?: string
          team_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collaborators?: Json | null
          content?: string | null
          created_at?: string
          description?: string | null
          document_type?: string
          extracted_fields?: Json
          file_path?: string
          id?: string
          metadata?: Json
          preview_url?: string | null
          risk_level?: string
          status?: string
          team_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      signature_audit_trail: {
        Row: {
          created_at: string
          event_data: Json
          event_hash: string
          event_type: string
          id: string
          ip_address: unknown | null
          previous_hash: string | null
          signature_request_id: string
          signer_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_hash: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          previous_hash?: string | null
          signature_request_id: string
          signer_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_hash?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          previous_hash?: string | null
          signature_request_id?: string
          signer_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_audit_trail_signature_request_id_fkey"
            columns: ["signature_request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_audit_trail_signer_id_fkey"
            columns: ["signer_id"]
            isOneToOne: false
            referencedRelation: "signature_signers"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_fields: {
        Row: {
          created_at: string
          field_type: string
          height: number
          id: string
          page_number: number
          position_x: number
          position_y: number
          required: boolean
          signature_request_id: string
          signer_id: string
          updated_at: string
          value: string | null
          width: number
        }
        Insert: {
          created_at?: string
          field_type: string
          height: number
          id?: string
          page_number: number
          position_x: number
          position_y: number
          required?: boolean
          signature_request_id: string
          signer_id: string
          updated_at?: string
          value?: string | null
          width: number
        }
        Update: {
          created_at?: string
          field_type?: string
          height?: number
          id?: string
          page_number?: number
          position_x?: number
          position_y?: number
          required?: boolean
          signature_request_id?: string
          signer_id?: string
          updated_at?: string
          value?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "signature_fields_signature_request_id_fkey"
            columns: ["signature_request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_fields_signer_id_fkey"
            columns: ["signer_id"]
            isOneToOne: false
            referencedRelation: "signature_signers"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_requests: {
        Row: {
          allow_decline: boolean | null
          completed_at: string | null
          compliance_level: string | null
          created_at: string
          document_id: string
          expires_at: string | null
          id: string
          last_reminder_sent: string | null
          legal_disclosure_accepted: boolean | null
          message: string | null
          metadata: Json | null
          reminder_frequency: unknown | null
          requestor_id: string
          require_phone_verification: boolean | null
          require_photo_id: boolean | null
          signing_type: string
          status: Database["public"]["Enums"]["signature_request_status"]
          terms_accepted: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          allow_decline?: boolean | null
          completed_at?: string | null
          compliance_level?: string | null
          created_at?: string
          document_id: string
          expires_at?: string | null
          id?: string
          last_reminder_sent?: string | null
          legal_disclosure_accepted?: boolean | null
          message?: string | null
          metadata?: Json | null
          reminder_frequency?: unknown | null
          requestor_id: string
          require_phone_verification?: boolean | null
          require_photo_id?: boolean | null
          signing_type?: string
          status?: Database["public"]["Enums"]["signature_request_status"]
          terms_accepted?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          allow_decline?: boolean | null
          completed_at?: string | null
          compliance_level?: string | null
          created_at?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          last_reminder_sent?: string | null
          legal_disclosure_accepted?: boolean | null
          message?: string | null
          metadata?: Json | null
          reminder_frequency?: unknown | null
          requestor_id?: string
          require_phone_verification?: boolean | null
          require_photo_id?: boolean | null
          signing_type?: string
          status?: Database["public"]["Enums"]["signature_request_status"]
          terms_accepted?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_signers: {
        Row: {
          access_code: string | null
          created_at: string
          decline_reason: string | null
          declined_at: string | null
          id: string
          phone_verified: boolean | null
          photo_id_path: string | null
          signature_image_path: string | null
          signature_request_id: string
          signature_type: Database["public"]["Enums"]["signature_type"] | null
          signed_at: string | null
          signer_email: string
          signer_name: string
          signer_phone: string | null
          signing_order: number
          status: Database["public"]["Enums"]["signer_status"]
          updated_at: string
          verification_code: string | null
          verification_code_expires_at: string | null
          viewed_at: string | null
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          decline_reason?: string | null
          declined_at?: string | null
          id?: string
          phone_verified?: boolean | null
          photo_id_path?: string | null
          signature_image_path?: string | null
          signature_request_id: string
          signature_type?: Database["public"]["Enums"]["signature_type"] | null
          signed_at?: string | null
          signer_email: string
          signer_name: string
          signer_phone?: string | null
          signing_order: number
          status?: Database["public"]["Enums"]["signer_status"]
          updated_at?: string
          verification_code?: string | null
          verification_code_expires_at?: string | null
          viewed_at?: string | null
        }
        Update: {
          access_code?: string | null
          created_at?: string
          decline_reason?: string | null
          declined_at?: string | null
          id?: string
          phone_verified?: boolean | null
          photo_id_path?: string | null
          signature_image_path?: string | null
          signature_request_id?: string
          signature_type?: Database["public"]["Enums"]["signature_type"] | null
          signed_at?: string | null
          signer_email?: string
          signer_name?: string
          signer_phone?: string | null
          signing_order?: number
          status?: Database["public"]["Enums"]["signer_status"]
          updated_at?: string
          verification_code?: string | null
          verification_code_expires_at?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "signature_signers_signature_request_id_fkey"
            columns: ["signature_request_id"]
            isOneToOne: false
            referencedRelation: "signature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          credits_remaining: number | null
          id: string
          plan_type: string | null
          status: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_remaining?: number | null
          id?: string
          plan_type?: string | null
          status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_remaining?: number | null
          id?: string
          plan_type?: string | null
          status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_invites: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          token: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          content: string
          created_at: string
          created_by: string
          description: string | null
          fields: Json
          id: string
          is_favorite: boolean
          is_published: boolean
          name: string
          sections: Json
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          created_by: string
          description?: string | null
          fields?: Json
          id?: string
          is_favorite?: boolean
          is_published?: boolean
          name: string
          sections?: Json
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          description?: string | null
          fields?: Json
          id?: string
          is_favorite?: boolean
          is_published?: boolean
          name?: string
          sections?: Json
          updated_at?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          density: string | null
          email_frequency: string | null
          font_size: string | null
          id: string
          notifications_enabled: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          density?: string | null
          email_frequency?: string | null
          font_size?: string | null
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          density?: string | null
          email_frequency?: string | null
          font_size?: string | null
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_signature_audit_trail_entry: {
        Args: {
          p_signature_request_id: string
          p_signer_id: string
          p_event_type: string
          p_event_data: Json
          p_ip_address: unknown
          p_user_agent: string
        }
        Returns: string
      }
    }
    Enums: {
      signature_request_status:
        | "draft"
        | "pending"
        | "completed"
        | "expired"
        | "cancelled"
        | "rejected"
      signature_type: "drawn" | "typed" | "uploaded" | "click_to_sign"
      signer_status: "pending" | "viewed" | "signed" | "rejected" | "expired"
      team_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      signature_request_status: [
        "draft",
        "pending",
        "completed",
        "expired",
        "cancelled",
        "rejected",
      ],
      signature_type: ["drawn", "typed", "uploaded", "click_to_sign"],
      signer_status: ["pending", "viewed", "signed", "rejected", "expired"],
      team_role: ["owner", "admin", "member"],
    },
  },
} as const
