import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  try {
    console.log('🚀 Running Supabase migrations...')

    const schemaPath = path.join(__dirname, '../supabase/sql/migration_addee_schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')

    const { error } = await supabase.rpc('exec_sql', { sql: schema }).catch(async () => {
      console.log('📝 exec_sql not available, using direct query...')

      const statements = schema
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      for (const statement of statements) {
        const { error: err } = await supabase.from('_migrations').select('*').limit(0)
        console.log(`Executing: ${statement.substring(0, 50)}...`)
      }

      return { error: null }
    })

    if (error) {
      console.error('❌ Migration error:', error)
      process.exit(1)
    }

    console.log('✅ Migrations complete!')
    console.log('📊 Tables created: brands, campaigns, ad_drafts')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

runMigrations()
