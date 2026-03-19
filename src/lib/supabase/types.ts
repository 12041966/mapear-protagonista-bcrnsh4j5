// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      empresas: {
        Row: {
          ativa: boolean
          cnpj: string | null
          data_criacao: string
          email_contato: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativa?: boolean
          cnpj?: string | null
          data_criacao?: string
          email_contato?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativa?: boolean
          cnpj?: string | null
          data_criacao?: string
          email_contato?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      observacoes: {
        Row: {
          area: string | null
          assigned_to: string | null
          codigo: string
          created_at: string
          date: string
          description: string | null
          detail: string | null
          empresa_id: string
          id: string
          resolution_type: string | null
          risk_level: string | null
          shift: string | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          area?: string | null
          assigned_to?: string | null
          codigo: string
          created_at?: string
          date: string
          description?: string | null
          detail?: string | null
          empresa_id: string
          id?: string
          resolution_type?: string | null
          risk_level?: string | null
          shift?: string | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          area?: string | null
          assigned_to?: string | null
          codigo?: string
          created_at?: string
          date?: string
          description?: string | null
          detail?: string | null
          empresa_id?: string
          id?: string
          resolution_type?: string | null
          risk_level?: string | null
          shift?: string | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'observacoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'observacoes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          cpf: string | null
          created_at: string
          email: string
          empresa_id: string | null
          id: string
          name: string
          registration_number: string | null
          role: string
          whatsapp: string | null
        }
        Insert: {
          active?: boolean
          cpf?: string | null
          created_at?: string
          email: string
          empresa_id?: string | null
          id: string
          name: string
          registration_number?: string | null
          role?: string
          whatsapp?: string | null
        }
        Update: {
          active?: boolean
          cpf?: string | null
          created_at?: string
          email?: string
          empresa_id?: string | null
          id?: string
          name?: string
          registration_number?: string | null
          role?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_empresa_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_company_admin: { Args: { check_empresa_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: empresas
//   id: uuid (not null, default: gen_random_uuid())
//   nome: text (not null)
//   cnpj: text (nullable)
//   email_contato: text (nullable)
//   telefone: text (nullable)
//   data_criacao: timestamp with time zone (not null, default: now())
//   ativa: boolean (not null, default: true)
// Table: observacoes
//   id: uuid (not null, default: gen_random_uuid())
//   codigo: text (not null)
//   empresa_id: uuid (not null)
//   user_id: uuid (not null)
//   date: timestamp with time zone (not null)
//   type: text (not null)
//   detail: text (nullable)
//   area: text (nullable)
//   shift: text (nullable)
//   risk_level: text (nullable)
//   description: text (nullable)
//   resolution_type: text (nullable)
//   status: text (not null, default: 'Pendente'::text)
//   assigned_to: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   email: text (not null)
//   name: text (not null)
//   active: boolean (not null, default: true)
//   created_at: timestamp with time zone (not null, default: now())
//   role: text (not null, default: 'Observador'::text)
//   whatsapp: text (nullable)
//   cpf: text (nullable)
//   registration_number: text (nullable)
//   empresa_id: uuid (nullable)

// --- CONSTRAINTS ---
// Table: empresas
//   PRIMARY KEY empresas_pkey: PRIMARY KEY (id)
// Table: observacoes
//   UNIQUE observacoes_codigo_key: UNIQUE (codigo)
//   FOREIGN KEY observacoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY observacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY observacoes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: profiles
//   UNIQUE profiles_email_key: UNIQUE (email)
//   FOREIGN KEY profiles_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id)
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: empresas
//   Policy "Admins can manage all companies" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin()
//     WITH CHECK: is_admin()
//   Policy "Users can view their own company" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.id = auth.uid())))
// Table: observacoes
//   Policy "Users can access their company's observations" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.id = auth.uid())))
//     WITH CHECK: (empresa_id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.id = auth.uid())))
// Table: profiles
//   Policy "Company admins can update profiles in their company" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_company_admin(empresa_id) OR is_admin())
//     WITH CHECK: (is_company_admin(empresa_id) OR is_admin())
//   Policy "Users can view profiles in their company" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR (id = auth.uid()) OR is_admin())

// --- DATABASE FUNCTIONS ---
// FUNCTION get_user_empresa_id()
//   CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
//    RETURNS uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT empresa_id FROM profiles WHERE id = auth.uid();
//   $function$
//
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.profiles (id, email, name, active, role, empresa_id)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       true,
//       COALESCE(NEW.raw_user_meta_data->>'role', 'Observador'),
//       NULLIF(NEW.raw_user_meta_data->>'empresa_id', '')::uuid
//     );
//     RETURN NEW;
//   END;
//   $function$
//
// FUNCTION is_admin()
//   CREATE OR REPLACE FUNCTION public.is_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//       SELECT EXISTS (
//         SELECT 1
//         FROM public.profiles
//         WHERE id = auth.uid() AND role = 'Administrador'
//       );
//     $function$
//
// FUNCTION is_company_admin(uuid)
//   CREATE OR REPLACE FUNCTION public.is_company_admin(check_empresa_id uuid)
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM profiles
//       WHERE id = auth.uid() AND role = 'Administrador' AND empresa_id = check_empresa_id
//     );
//   $function$
//

// --- INDEXES ---
// Table: observacoes
//   CREATE UNIQUE INDEX observacoes_codigo_key ON public.observacoes USING btree (codigo)
// Table: profiles
//   CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)
