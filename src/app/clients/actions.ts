'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendApprovalRequestEmail } from '@/lib/email'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bloggy.online'

export async function sendApprovalForPost(formData: FormData) {
  const postId = formData.get('postId') as string
  if (!postId) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, client_id, clients(name, contact_email)')
    .eq('id', postId)
    .eq('created_by', user.id)
    .single()

  if (!post) return

  const client = Array.isArray(post.clients) ? post.clients[0] : post.clients as { name: string; contact_email: string | null } | null
  if (!client?.contact_email) return

  const token = crypto.randomUUID()
  const { error } = await supabase.from('posts').update({
    approval_status: 'pending_approval',
    approval_token: token,
    approval_sent_at: new Date().toISOString(),
    client_feedback: null,
    approved_at: null,
  }).eq('id', postId)

  if (error) return

  const approvalUrl = `${BASE_URL}/approve/${token}`
  await sendApprovalRequestEmail(client.contact_email, client.name, post.title ?? 'Untitled Post', approvalUrl)

  revalidatePath(`/clients/${post.client_id}`)
}

export async function upsertClient(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const id = formData.get('id') as string | null

    const basePayload = {
      name: formData.get('name') as string,
      industry: (formData.get('industry') as string) || null,
      website: (formData.get('website') as string) || null,
      brand_voice: (formData.get('brand_voice') as string) || null,
    }

    const fullPayload = {
      ...basePayload,
      contact_email: (formData.get('contact_email') as string) || null,
      wp_url: (formData.get('wp_url') as string) || null,
      wp_username: (formData.get('wp_username') as string) || null,
      wp_app_password: (formData.get('wp_app_password') as string) || null,
      logo_url: (formData.get('logo_url') as string) || null,
      primary_color: (formData.get('primary_color') as string) || null,
      brand_guidelines: (formData.get('brand_guidelines') as string) || null,
      target_keywords: (formData.get('target_keywords') as string) || null,
    }

    if (id) {
      // Try full payload first, fall back to base if a column is missing
      const { error: e1 } = await supabase
        .from('clients')
        .update(fullPayload)
        .eq('id', id)
        .eq('created_by', user.id)

      if (e1) {
        const { error: e2 } = await supabase
          .from('clients')
          .update(basePayload)
          .eq('id', id)
          .eq('created_by', user.id)

        if (e2) return { error: e2.message }
      }
    } else {
      // Check plan limit
      const [{ data: sub }, { count: clientCount }] = await Promise.all([
        supabase.from('subscriptions').select('sites_limit').eq('user_id', user.id).single(),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('created_by', user.id),
      ])
      const sitesLimit = sub?.sites_limit ?? 2
      if ((clientCount ?? 0) >= sitesLimit) {
        return { error: `You've reached your ${sitesLimit}-client limit. Upgrade your plan to add more.` }
      }

      const { error: e1 } = await supabase
        .from('clients')
        .insert({ ...fullPayload, created_by: user.id })

      if (e1) {
        const { error: e2 } = await supabase
          .from('clients')
          .insert({ ...basePayload, created_by: user.id })

        if (e2) return { error: e2.message }
      }
    }

    revalidatePath('/clients')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unexpected error saving client'
    return { error: msg }
  }
}

export async function deleteClient(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('clients').delete().eq('id', id).eq('created_by', user.id)
    revalidatePath('/clients')
  } catch {
    // ignore
  }
}
