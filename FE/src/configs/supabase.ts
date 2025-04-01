import configs from '@/configs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = configs.supabaseUrl
const supabaseKey = configs.supabaseKey
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
