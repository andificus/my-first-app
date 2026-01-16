import { supabase } from './supabaseClient'

export async function requireUser() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}
