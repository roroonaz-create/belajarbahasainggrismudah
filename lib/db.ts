import { Pool } from 'pg'
import { supabase } from './supabase'

const connectionString = `postgresql://postgres:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'vszaaobgjxacvvoozmhd.supabase.co'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'postgres'}`

const pool = new Pool({
  connectionString,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err)
})

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
}

export { supabase }

export default pool
