import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

// Initialize Supabase Client with safe fallback
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://demo-project.supabase.co'
  );
};

// ───────────── AUTH HELPERS ─────────────

export const signUpWithSupabase = async (email, password, metadata = {}) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured in environment variables.');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  if (error) throw error;
  return data;
};

export const signInWithSupabase = async (email, password) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured in environment variables.');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured in environment variables.');
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
};

export const signOutSupabase = async () => {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSupabaseUser = async () => {
  if (!isSupabaseConfigured()) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// ───────────── STORAGE HELPERS ─────────────

export const uploadSupabaseFile = async (bucket, path, file) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials not configured.');
  }
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) throw error;

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
};

// ───────────── REALTIME HELPERS ─────────────

export const subscribeToTableChanges = (table, callback) => {
  if (!isSupabaseConfigured()) return null;
  const channel = supabase
    .channel(`public:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return channel;
};
