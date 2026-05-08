import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: users, error: listError } = await admin.auth.admin.listUsers()
    if (listError) throw listError

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, { password })
    if (updateError) throw updateError

    return NextResponse.json({ success: true, message: `Password set for ${email}` })
  } catch (error) {
    console.error('Error setting password:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
