import { createClient } from '@supabase/supabase-js'

// Supabase configuration using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database interface for nmap_reports table
export interface NmapReport {
  id: number;
  scan_id: string;
  target: string;
  scan_result: string;
  analysis: string;
  timestampz: string;
}

// Your direct PostgreSQL connection string (for reference)
export const postgresConnectionString = 'postgresql://postgres.vabjbpunzhcphtgsmclm:Amarnadh@1234@aws-0-us-east-2.pooler.supabase.com:6543/postgres'

// Instructions:
// 1. Go to https://supabase.com/dashboard
// 2. Select your project
// 3. Go to Settings > API
// 4. Copy the "Project URL" and "anon public" key
// 5. Create a .env.local file with:
//    NEXT_PUBLIC_SUPABASE_URL=your_project_url
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key 