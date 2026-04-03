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
          codigo_empresa: string
          data_criacao: string
          email_contato: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          ativa?: boolean
          cnpj?: string | null
          codigo_empresa: string
          data_criacao?: string
          email_contato?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          ativa?: boolean
          cnpj?: string | null
          codigo_empresa?: string
          data_criacao?: string
          email_contato?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      logs_observacoes: {
        Row: {
          data_hora: string
          empresa_id: string
          id: string
          justificativa: string | null
          observacao_id: string
          status_anterior: string | null
          status_novo: string
          usuario_id: string | null
        }
        Insert: {
          data_hora?: string
          empresa_id: string
          id?: string
          justificativa?: string | null
          observacao_id: string
          status_anterior?: string | null
          status_novo: string
          usuario_id?: string | null
        }
        Update: {
          data_hora?: string
          empresa_id?: string
          id?: string
          justificativa?: string | null
          observacao_id?: string
          status_anterior?: string | null
          status_novo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'logs_observacoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'logs_observacoes_observacao_id_fkey'
            columns: ['observacao_id']
            isOneToOne: false
            referencedRelation: 'observacoes'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'logs_observacoes_usuario_id_fkey'
            columns: ['usuario_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      observacoes: {
        Row: {
          area: string | null
          assigned_to: string | null
          codigo: string
          completion_date: string | null
          created_at: string
          date: string
          description: string | null
          detail: string | null
          due_date: string | null
          empresa_id: string
          id: string
          justificativa_cancelamento: string | null
          justificativa_status: string | null
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
          completion_date?: string | null
          created_at?: string
          date: string
          description?: string | null
          detail?: string | null
          due_date?: string | null
          empresa_id: string
          id?: string
          justificativa_cancelamento?: string | null
          justificativa_status?: string | null
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
          completion_date?: string | null
          created_at?: string
          date?: string
          description?: string | null
          detail?: string | null
          due_date?: string | null
          empresa_id?: string
          id?: string
          justificativa_cancelamento?: string | null
          justificativa_status?: string | null
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
          data_envio_convite: string | null
          data_expiracao_convite: string | null
          email: string
          empresa_id: string | null
          id: string
          id_funcionario: number | null
          is_super_admin: boolean
          name: string
          registration_number: string | null
          role: string
          status: string | null
          status_convite: string | null
          token_convite: string | null
          whatsapp: string | null
        }
        Insert: {
          active?: boolean
          cpf?: string | null
          created_at?: string
          data_envio_convite?: string | null
          data_expiracao_convite?: string | null
          email: string
          empresa_id?: string | null
          id: string
          id_funcionario?: number | null
          is_super_admin?: boolean
          name: string
          registration_number?: string | null
          role?: string
          status?: string | null
          status_convite?: string | null
          token_convite?: string | null
          whatsapp?: string | null
        }
        Update: {
          active?: boolean
          cpf?: string | null
          created_at?: string
          data_envio_convite?: string | null
          data_expiracao_convite?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          id_funcionario?: number | null
          is_super_admin?: boolean
          name?: string
          registration_number?: string | null
          role?: string
          status?: string | null
          status_convite?: string | null
          token_convite?: string | null
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
      sequencias: {
        Row: {
          data_atualizacao: string
          empresa_id: string
          id: string
          proximo_numero: number
          tipo_sequencia: string
        }
        Insert: {
          data_atualizacao?: string
          empresa_id: string
          id?: string
          proximo_numero?: number
          tipo_sequencia: string
        }
        Update: {
          data_atualizacao?: string
          empresa_id?: string
          id?: string
          proximo_numero?: number
          tipo_sequencia?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sequencias_empresa_id_fkey'
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
          oculto: boolean
          opcao_id: string
          ordem: number
          valor_customizado: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          empresa_id: string
          id?: string
          oculto?: boolean
          opcao_id: string
          ordem?: number
          valor_customizado: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          empresa_id?: string
          id?: string
          oculto?: boolean
          opcao_id?: string
          ordem?: number
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
          empresa_id: string | null
          id: string
          nome_opcao: string
          ordem: number
          tabela_id: string
          valor_padrao: string
        }
        Insert: {
          data_criacao?: string
          empresa_id?: string | null
          id?: string
          nome_opcao: string
          ordem?: number
          tabela_id: string
          valor_padrao: string
        }
        Update: {
          data_criacao?: string
          empresa_id?: string | null
          id?: string
          nome_opcao?: string
          ordem?: number
          tabela_id?: string
          valor_padrao?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tabelas_sistema_opcoes_empresa_id_fkey'
            columns: ['empresa_id']
            isOneToOne: false
            referencedRelation: 'empresas'
            referencedColumns: ['id']
          },
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
      create_secondary_profile: {
        Args: {
          p_empresa_id: string
          p_id_funcionario: number
          p_name: string
          p_role?: string
          p_whatsapp: string
        }
        Returns: undefined
      }
      get_empresa_id_by_code: { Args: { p_codigo: string }; Returns: string }
      get_my_companies: {
        Args: never
        Returns: {
          active: boolean
          empresa_id: string
          nome_empresa: string
          profile_id: string
          role: string
          status: string
        }[]
      }
      get_next_sequence_value: {
        Args: { p_empresa_id: string; p_tipo: string }
        Returns: number
      }
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
//   codigo_empresa: text (not null)
// Table: logs_observacoes
//   id: uuid (not null, default: gen_random_uuid())
//   observacao_id: uuid (not null)
//   usuario_id: uuid (nullable)
//   status_anterior: text (nullable)
//   status_novo: text (not null)
//   justificativa: text (nullable)
//   data_hora: timestamp with time zone (not null, default: now())
//   empresa_id: uuid (not null)
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
//   due_date: timestamp with time zone (nullable)
//   completion_date: timestamp with time zone (nullable)
//   justificativa_status: text (nullable)
//   justificativa_cancelamento: text (nullable)
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
//   status: text (nullable, default: 'pendente_confirmacao'::text)
//   id_funcionario: integer (nullable)
//   is_super_admin: boolean (not null, default: false)
//   status_convite: text (nullable, default: 'aceito'::text)
//   data_envio_convite: timestamp with time zone (nullable)
//   data_expiracao_convite: timestamp with time zone (nullable)
//   token_convite: text (nullable)
// Table: sequencias
//   id: uuid (not null, default: gen_random_uuid())
//   empresa_id: uuid (not null)
//   tipo_sequencia: text (not null)
//   proximo_numero: integer (not null, default: 1)
//   data_atualizacao: timestamp with time zone (not null, default: now())
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
//   oculto: boolean (not null, default: false)
//   ordem: integer (not null, default: 0)
// Table: tabelas_sistema_opcoes
//   id: uuid (not null, default: gen_random_uuid())
//   tabela_id: uuid (not null)
//   nome_opcao: text (not null)
//   valor_padrao: text (not null)
//   data_criacao: timestamp with time zone (not null, default: now())
//   empresa_id: uuid (nullable)
//   ordem: integer (not null, default: 0)

// --- CONSTRAINTS ---
// Table: configuracoes_sistema
//   FOREIGN KEY configuracoes_sistema_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY configuracoes_sistema_pkey: PRIMARY KEY (id)
// Table: efetivo_mensal
//   FOREIGN KEY efetivo_mensal_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE efetivo_mensal_empresa_id_mes_ano_key: UNIQUE (empresa_id, mes, ano)
//   PRIMARY KEY efetivo_mensal_pkey: PRIMARY KEY (id)
// Table: empresas
//   UNIQUE empresas_codigo_empresa_key: UNIQUE (codigo_empresa)
//   PRIMARY KEY empresas_pkey: PRIMARY KEY (id)
// Table: logs_observacoes
//   FOREIGN KEY logs_observacoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   FOREIGN KEY logs_observacoes_observacao_id_fkey: FOREIGN KEY (observacao_id) REFERENCES observacoes(id) ON DELETE CASCADE
//   PRIMARY KEY logs_observacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY logs_observacoes_usuario_id_fkey: FOREIGN KEY (usuario_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: observacoes
//   UNIQUE observacoes_codigo_key: UNIQUE (codigo)
//   FOREIGN KEY observacoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   PRIMARY KEY observacoes_pkey: PRIMARY KEY (id)
//   FOREIGN KEY observacoes_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
// Table: profiles
//   FOREIGN KEY profiles_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id)
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
// Table: sequencias
//   FOREIGN KEY sequencias_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
//   UNIQUE sequencias_empresa_id_tipo_sequencia_key: UNIQUE (empresa_id, tipo_sequencia)
//   PRIMARY KEY sequencias_pkey: PRIMARY KEY (id)
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
//   FOREIGN KEY tabelas_sistema_opcoes_empresa_id_fkey: FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE
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
//     USING: (id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.email = (( SELECT users.email            FROM auth.users           WHERE (users.id = auth.uid())))::text)))
// Table: logs_observacoes
//   Policy "Super admins can do all on logs_observacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can view logs for their company" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR is_admin())
// Table: observacoes
//   Policy "Super admins can do all on observacoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can access their company's observations" (ALL, PERMISSIVE) roles={authenticated}
//     USING: (empresa_id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.email = (( SELECT users.email            FROM auth.users           WHERE (users.id = auth.uid())))::text)))
//     WITH CHECK: (empresa_id IN ( SELECT profiles.empresa_id    FROM profiles   WHERE (profiles.email = (( SELECT users.email            FROM auth.users           WHERE (users.id = auth.uid())))::text)))
// Table: profiles
//   Policy "Company admins can delete profiles in their company" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: (is_company_admin(empresa_id) OR is_admin())
//   Policy "Company admins can update profiles in their company" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: (is_company_admin(empresa_id) OR is_admin())
//     WITH CHECK: (is_company_admin(empresa_id) OR is_admin())
//   Policy "Super admins can do all on profiles" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can view profiles in their company" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id IN ( SELECT profiles_1.empresa_id    FROM profiles profiles_1   WHERE (profiles_1.email = (( SELECT users.email            FROM auth.users           WHERE (users.id = auth.uid())))::text))) OR (id = auth.uid()) OR is_admin())
// Table: sequencias
//   Policy "Super admins can manage sequencias" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()
//   Policy "Users can view sequencias for their company" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR is_admin())
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
//   Policy "Company admins can manage their own options" (ALL, PERMISSIVE) roles={authenticated}
//     USING: ((empresa_id = get_user_empresa_id()) OR is_admin())
//     WITH CHECK: ((empresa_id = get_user_empresa_id()) OR is_admin())
//   Policy "Super admins can all on opcoes" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_super_admin()
//     WITH CHECK: is_super_admin()

// --- DATABASE FUNCTIONS ---
// FUNCTION create_secondary_profile(uuid, text, text, integer, text)
//   CREATE OR REPLACE FUNCTION public.create_secondary_profile(p_empresa_id uuid, p_name text, p_whatsapp text, p_id_funcionario integer, p_role text DEFAULT 'Observador'::text)
//    RETURNS void
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       -- Ensure the user is authenticated
//       IF auth.uid() IS NULL THEN
//           RAISE EXCEPTION 'Not authenticated';
//       END IF;
//
//       -- Insert the new profile
//       INSERT INTO public.profiles (id, email, name, whatsapp, empresa_id, id_funcionario, role, status, active)
//       VALUES (
//           gen_random_uuid(),
//           (SELECT email FROM auth.users WHERE id = auth.uid()),
//           p_name,
//           p_whatsapp,
//           p_empresa_id,
//           p_id_funcionario,
//           p_role,
//           'ativo',
//           true
//       )
//       ON CONFLICT (email, empresa_id) DO NOTHING;
//   END;
//   $function$
//
// FUNCTION generate_codigo_empresa()
//   CREATE OR REPLACE FUNCTION public.generate_codigo_empresa()
//    RETURNS trigger
//    LANGUAGE plpgsql
//   AS $function$
//   DECLARE
//       new_code TEXT;
//       code_exists BOOLEAN;
//       creation_year TEXT;
//   BEGIN
//       IF NULLIF(TRIM(NEW.codigo_empresa), '') IS NULL THEN
//           creation_year := TO_CHAR(COALESCE(NEW.data_criacao, NOW()), 'YYYY');
//           LOOP
//               new_code := 'EMP-' || creation_year || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
//
//               SELECT EXISTS(SELECT 1 FROM public.empresas WHERE codigo_empresa = new_code) INTO code_exists;
//
//               IF NOT code_exists THEN
//                   NEW.codigo_empresa := new_code;
//                   EXIT;
//               END IF;
//           END LOOP;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION get_empresa_id_by_code(text)
//   CREATE OR REPLACE FUNCTION public.get_empresa_id_by_code(p_codigo text)
//    RETURNS uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT id FROM public.empresas WHERE codigo_empresa = p_codigo LIMIT 1;
//   $function$
//
// FUNCTION get_my_companies()
//   CREATE OR REPLACE FUNCTION public.get_my_companies()
//    RETURNS TABLE(profile_id uuid, empresa_id uuid, nome_empresa text, role text, status text, active boolean)
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT p.id, p.empresa_id, e.nome, p.role, p.status, p.active
//     FROM profiles p
//     JOIN empresas e ON p.empresa_id = e.id
//     WHERE p.email = (SELECT email FROM auth.users WHERE id = auth.uid())
//     AND p.status = 'ativo' AND p.active = true;
//   $function$
//
// FUNCTION get_next_sequence_value(uuid, text)
//   CREATE OR REPLACE FUNCTION public.get_next_sequence_value(p_empresa_id uuid, p_tipo text)
//    RETURNS integer
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//       v_current integer;
//   BEGIN
//       INSERT INTO public.sequencias (empresa_id, tipo_sequencia, proximo_numero)
//       VALUES (p_empresa_id, p_tipo, 2)
//       ON CONFLICT (empresa_id, tipo_sequencia)
//       DO UPDATE SET
//           proximo_numero = public.sequencias.proximo_numero + 1,
//           data_atualizacao = NOW()
//       RETURNING (proximo_numero - 1) INTO v_current;
//
//       RETURN v_current;
//   END;
//   $function$
//
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
//     INSERT INTO public.profiles (id, email, name, active, role, empresa_id, whatsapp, registration_number, cpf, status, id_funcionario)
//     VALUES (
//       NEW.id,
//       NEW.email,
//       COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       true,
//       COALESCE(NEW.raw_user_meta_data->>'role', 'Observador'),
//       NULLIF(NEW.raw_user_meta_data->>'empresa_id', '')::uuid,
//       NEW.raw_user_meta_data->>'whatsapp',
//       NEW.raw_user_meta_data->>'registration_number',
//       NEW.raw_user_meta_data->>'cpf',
//       'pendente_confirmacao',
//       NULLIF(NEW.raw_user_meta_data->>'id_funcionario', '')::integer
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
//     SELECT EXISTS (
//       SELECT 1
//       FROM public.profiles
//       WHERE id = auth.uid() AND is_super_admin = true
//     );
//   $function$
//
// FUNCTION is_company_admin(uuid)
//   CREATE OR REPLACE FUNCTION public.is_company_admin(check_empresa_id uuid)
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM profiles
//       WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
//       AND role = 'Administrador' AND empresa_id = check_empresa_id
//     );
//   $function$
//
// FUNCTION is_super_admin()
//   CREATE OR REPLACE FUNCTION public.is_super_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1
//       FROM public.profiles
//       WHERE id = auth.uid() AND is_super_admin = true
//     );
//   $function$
//
// FUNCTION log_observacao_status_change()
//   CREATE OR REPLACE FUNCTION public.log_observacao_status_change()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//       IF OLD.status IS DISTINCT FROM NEW.status THEN
//           INSERT INTO public.logs_observacoes (
//               observacao_id,
//               usuario_id,
//               status_anterior,
//               status_novo,
//               justificativa,
//               empresa_id
//           ) VALUES (
//               NEW.id,
//               auth.uid(),
//               OLD.status,
//               NEW.status,
//               COALESCE(NEW.justificativa_status, NEW.justificativa_cancelamento),
//               NEW.empresa_id
//           );
//           -- Reseta a justificativa na tabela principal para atuar como campo transiente
//           NEW.justificativa_status := NULL;
//       END IF;
//       RETURN NEW;
//   END;
//   $function$
//
// FUNCTION update_profile_status_on_login()
//   CREATE OR REPLACE FUNCTION public.update_profile_status_on_login()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     IF NEW.last_sign_in_at IS NOT NULL AND OLD.last_sign_in_at IS NULL THEN
//       UPDATE public.profiles SET status = 'ativo' WHERE id = NEW.id;
//     END IF;
//     RETURN NEW;
//   END;
//   $function$
//

// --- TRIGGERS ---
// Table: empresas
//   ensure_codigo_empresa: CREATE TRIGGER ensure_codigo_empresa BEFORE INSERT ON public.empresas FOR EACH ROW EXECUTE FUNCTION generate_codigo_empresa()
// Table: observacoes
//   on_observacao_status_change: CREATE TRIGGER on_observacao_status_change BEFORE UPDATE ON public.observacoes FOR EACH ROW EXECUTE FUNCTION log_observacao_status_change()

// --- INDEXES ---
// Table: efetivo_mensal
//   CREATE UNIQUE INDEX efetivo_mensal_empresa_id_mes_ano_key ON public.efetivo_mensal USING btree (empresa_id, mes, ano)
// Table: empresas
//   CREATE UNIQUE INDEX empresas_codigo_empresa_key ON public.empresas USING btree (codigo_empresa)
// Table: observacoes
//   CREATE UNIQUE INDEX observacoes_codigo_key ON public.observacoes USING btree (codigo)
// Table: profiles
//   CREATE UNIQUE INDEX profiles_email_empresa_id_key ON public.profiles USING btree (email, empresa_id)
//   CREATE UNIQUE INDEX profiles_empresa_id_registration_number_key ON public.profiles USING btree (empresa_id, registration_number) WHERE ((registration_number IS NOT NULL) AND (registration_number <> ''::text))
//   CREATE INDEX profiles_token_convite_idx ON public.profiles USING btree (token_convite)
// Table: sequencias
//   CREATE UNIQUE INDEX sequencias_empresa_id_tipo_sequencia_key ON public.sequencias USING btree (empresa_id, tipo_sequencia)
// Table: tabelas_sistema_definicoes
//   CREATE UNIQUE INDEX tabelas_sistema_definicoes_chave_key ON public.tabelas_sistema_definicoes USING btree (chave)
// Table: tabelas_sistema_empresa_opcoes
//   CREATE UNIQUE INDEX tabelas_sistema_empresa_opcoes_empresa_id_opcao_id_key ON public.tabelas_sistema_empresa_opcoes USING btree (empresa_id, opcao_id)
