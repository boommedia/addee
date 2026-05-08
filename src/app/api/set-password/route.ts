import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const { email, password, action = 'set' } = await request.json()

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

    let user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    // Create user if doesn't exist
    if (!user && action === 'create') {
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })
      if (createError) throw createError
      user = newUser.user
      return NextResponse.json({ success: true, message: `User created for ${email}` })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found. Try action=create first.' }, { status: 404 })
    }

    const { error: updateError } = await admin.auth.admin.updateUserById(user.id, { password })
    if (updateError) throw updateError

    return NextResponse.json({ success: true, message: `Password set for ${email}` })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
