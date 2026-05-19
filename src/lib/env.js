export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.NEXT_PUBLIC_SUPABASE_URL

export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const rawPublicAppUrl =
  import.meta.env.VITE_PUBLIC_APP_URL ?? import.meta.env.NEXT_PUBLIC_PUBLIC_APP_URL

export const publicAppUrl = rawPublicAppUrl
  ? rawPublicAppUrl.replace(/\/+$/, '')
  : ''

export const isSupabaseConfigured =
  Boolean(supabaseUrl) && Boolean(supabaseAnonKey)