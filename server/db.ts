import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // use your Supabase DB URL
  ssl: { rejectUnauthorized: false }, // important for Supabase
});

export default pool;
