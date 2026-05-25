import { createClient } from '@supabase/supabase-js'

// Substitua pelos valores do seu projeto Supabase:
const supabaseUrl = 'https://jafnqdmcwptjebrnvbnr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphZm5xZG1jd3B0amVicm52Ym5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Mjk0MjQsImV4cCI6MjA5NTMwNTQyNH0.duZT6rwVMYIJwuncQu2vAn4GvtzxLrzvgpg_RQk1_jM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
