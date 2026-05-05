const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ycllpmkmpokqzbnspigc.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUsers() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    if (error) {
      console.log('Error:', error)
      return
    }
    
    console.log('\n=== SUPABASE USERS ===')
    users.forEach(u => {
      console.log(`Email: "${u.email}" | ID: ${u.id}`)
    })
  } catch (err) {
    console.error('Exception:', err.message)
  }
}

checkUsers()
