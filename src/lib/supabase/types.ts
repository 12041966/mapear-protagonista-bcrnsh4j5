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
      configuracoes_sistema: {
        Row: {
          categoria: string
          chave: string
          created_at: string
          empresa_id: string
          id: string
          valor: string
        }
        Insert: {
          categoria: string
          chave: string
          created_at?: string
          empresa_id: string
          id?: string
          valor: string
        }
        Update: {
          categoria?: string
          chave?: string
          created_at?: string
          empresa_id?: string
          id?: string
          valor?: string
        }
        Relationships: [
          {
            foreignKeyName: 'configuracoes_sistema_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      efetivo_mensal: {
        Row: {
          ano: number
          created_at: string
          data_atualizacao: string | null
          empresa_id: string
          id: string
          mes: string
          quantidade_funcionarios: number
        }
        Insert: {
          ano: number
          created_at?: string
          data_atualizacao?: string | null
          empresa_id: string
          id?: string
          mes: string
          quantidade_funcionarios: number
        }
        Update: {
          ano?: number
          created_at?: string
          data_atualizacao?: string | null
          empresa_id?: string
          id?: string
          mes?: string
          quantidade_funcionarios?: number
        }
        Relationships: [
          {
            foreignKeyName: 'efetivo_mensal_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
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
          manager_comments: string | null
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
          manager_comments?: string | null
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
          manager_comments?: string | null
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
      tabelas_sistema: {
        Row: {
          dados_json: Json
          data_atualizacao: string
          data_criacao: string
          descricao: string | null
          empresa_id: string
          id: string
          nome_tabela: string
        }
        Insert: {
          dados_json?: Json
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome_tabela: string
        }
        Update: {
          dados_json?: Json
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome_tabela?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tabelas_sistema_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
        ]
      }
      tabelas_sistema_definicoes: {
        Row: {
          chave: string
          data_criacao: string
          descricao: string | null
          id: string
          nome_tabela: string
        }
        Insert: {
          chave: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          nome_tabela: string
        }
        Update: {
          chave?: string
          data_criacao?: string
          descricao?: string | null
          id?: string
          nome_tabela?: string
        }
        Relationships: []
      }
      tabelas_sistema_empresa_opcoes: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          empresa_id: string
          id: string
          opcao_id: string
          valor_customizado: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          empresa_id: string
          id?: string
          opcao_id: string
          valor_customizado: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          empresa_id?: string
          id?: string
          opcao_id?: string
          valor_customizado?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tabelas_sistema_empresa_opcoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tabelas_sistema_empresa_opcoes_opcao_id_fkey'
            columns: ['opcao_id']
            isOneToOne: false
            referencedRelation: 'tabelas_sistema_opcoes'
            referencedColumns: ['id']
          },
        ]
      }
      tabelas_sistema_opcoes: {
        Row: {
          data_criacao: string
          id: string
          nome_opcao: string
          tabela_id: string
          valor_padrao: string
        }
        Insert: {
          data_criacao?: string
          id?: string
          nome_opcao: string
          tabela_id: string
          valor_padrao: string
        }
        Update: {
          data_criacao?: string
          id?: string
          nome_opcao?: string
          tabela_id?: string
          valor_padrao?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tabelas_sistema_opcoes_tabela_id_fkey'
            columns: ['tabela_id']
            isOneToOne: false
            referencedRelation: 'tabelas_sistema_definicoes'
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
      is_super_admin: { Args: never; Returns: boolean }
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
// Table: configuracoes_sistema
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   chave: text (not null)
//   valor: text (not null)
//   categoria: text (not null)
//   created_at: timestamp with time zone (not null, default: now())
// Table: efetivo_mensal
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   mes: text (not null)
//   ano: integer (not null)
//   quantidade_funcionarios: integer (not null)
//   created_at: timestamp with time zone (not null, default: now())
//   data_atualizacao: timestamp with time zone (nullable, default: now())
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
//   manager_comments: text (nullable)
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
// Table: tabelas_sistema
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   nome_tabela: text (not null)
//   descricao: text (nullable)
//   dados_json: jsonb (not null, default: '{}'::jsonb)
//   data_criacao: timestamp with time zone (not null, default: now())
//   data_atualizacao: timestamp with time zone (not null, default: now())
// Table: tabelas_sistema_definicoes
//   id: uuid (not null, default: gen_random_uuid())
//   nome_tabela: text (not null)
//   descricao: text (nullable)
//   chave: text (not null)
//   data_criacao: timestamp with time zone (not null, default: now())
// Table: tabelas_sistema_empresa_opcoes
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   opcao_id: uuid (not null)
//   valor_customizado: text (not null)
//   data_criacao: timestamp with time zone (not null, default: now())
//   data_atualizacao: timestamp with time zone (not null, default: now())
// Table: tabelas_sistema_opcoes
//   id: uuid (not null, default: gen_random_uuid())
//   tabela_id: uuid (not null)
//   nome_opcao: text (not null)
//   valor_padrao: text (not null)
//   data_criacao: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: configuracoes_sistema
//   FOREIGN KEY configuracoes_sistema_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY configuracoes_sistema_pkey: PRIMARY KEY (id)
// Table: efetivo_mensal
//   FOREIGN KEY efetivo_mensal_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE efetivo_mensal_empresa_id_mes_ano_key: UNIQUE (empresa_id, mes, ano)
//   PRIMARY KEY efetivo_mensal_pkey: PRIMARY KEY (id)
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
// Table: tabelas_sistema
//   FOREIGN KEY tabelas_sistema_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY tabelas_sistema_pkey: PRIMARY KEY (id)
// Table: tabelas_sistema_definicoes
//   UNIQUE tabelas_sistema_definicoes_chave_key: UNIQUE (chave)
//   PRIMARY KEY tabelas_sistema_definicoes_pkey: PRIMARY KEY (id)
// Table: tabelas_sistema_empresa_opcoes
//   FOREIGN KEY tabelas_sistema_empresa_opcoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE tabelas_sistema_empresa_opcoes_empresa_id_opcao_id_key: UNIQUE (empresa_id, opcao_id)
//   FOREIGN KEY tabelas_sistema_empresa_opcoes_opcao_id_fkey: FOREIGN KEY (opcao_id) REFERENCES tabelas_sistema_opcoes(id) ON DELETE CASCADE
//   PRIMARY KEY tabelas_sistema_empresa_opcoes_pkey: PRIMARY KEY (id)
// Table: tabelas_sistema_opcoes
//   PRIMARY KEY tabelas_sistema_opcoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY tabelas_sistema_opcoes_tabela_id_fkey: FOREIGN KEY (tabela_id) REFERENCES tabelas_sistema_definicoes(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: configuracoes_sistema
//   Policy "Super admins can do all on configuracoes_sistema" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can manage system configs for their company" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR is_admin())
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) OR is_admin())
// Table: efetivo_mensal
//   Policy "Super admins can do all on efetivo_mensal" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can manage headcount for their company" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR is_admin())
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) OR is_admin())
// Table: empresas
//   Policy "Admins can manage all companies" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_admin()
//     WITH CHECK: is_admin()
//   Policy "Super admins can do all on empresas" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can view their own company" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: (id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.id = auth.uid())))
// Table: observacoes
//   Policy "Super admins can do all on observacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can access their company's observations" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.id = auth.uid())))
//     WITH CHECK: (empresa_id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.id = auth.uid())))
// Table: profiles
//   Policy "Company admins can update profiles in their company" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_company_admin(empresa_id) OR is_admin())
//     WITH CHECK: (is_company_admin(empresa_id) OR is_admin())
//   Policy "Super admins can do all on profiles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can view profiles in their company" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR (id = auth.uid()) OR is_admin())
// Table: tabelas_sistema
//   Policy "Super admins can do all on tabelas_sistema" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can manage tabelas_sistema for their company" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR is_admin())
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) OR is_admin())
// Table: tabelas_sistema_definicoes
//   Policy "Authenticated users can select definicoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Super admins can all on definicoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
// Table: tabelas_sistema_empresa_opcoes
//   Policy "Users manage custom options for their company" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR is_admin())
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) OR is_admin())
// Table: tabelas_sistema_opcoes
//   Policy "Authenticated users can select opcoes" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Super admins can all on opcoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()

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
//         WHERE id = auth.uid() AND email = 'ferbatsan@hotmail.com'
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
// FUNCTION is_super_admin()
//   CREATE OR REPLACE FUNCTION public.is_super_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//       SELECT EXISTS (
//         SELECT 1
//         FROM public.profiles
//         WHERE id = auth.uid() AND email = 'ferbatsan@hotmail.com'
//       );
//     $function$
//

// --- INDEXES ---
// Table: efetivo_mensal
//   CREATE UNIQUE INDEX efetivo_mensal_empresa_id_mes_ano_key ON public.efetivo_mensal USING btree (empresa_id, mes, ano)
// Table: observacoes
//   CREATE UNIQUE INDEX observacoes_codigo_key ON public.observacoes USING btree (codigo)
// Table: profiles
//   CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email)
// Table: tabelas_sistema_definicoes
//   CREATE UNIQUE INDEX tabelas_sistema_definicoes_chave_key ON public.tabelas_sistema_definicoes USING btree (chave)
// Table: tabelas_sistema_empresa_opcoes
//   CREATE UNIQUE INDEX tabelas_sistema_empresa_opcoes_empresa_id_opcao_id_key ON public.tabelas_sistema_empresa_opcoes USING btree (empresa_id, opcao_id)
