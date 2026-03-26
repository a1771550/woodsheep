import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default {
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async addProperty(property) {
    const { data, error } = await supabase.from('properties').insert([property]).select()

    if (error) throw error
    return data[0]
  },

  async updateProperty(id, updates) {
    const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select()

    if (error) throw error
    return data[0]
  },

  async deleteProperty(id) {
    const { error } = await supabase.from('properties').delete().eq('id', id)

    if (error) throw error
    return true
  },
}
