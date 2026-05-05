import { createClient as createServiceClient } from '@supabase/supabase-js'

const supabase = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function fireWebhooks(userId: string, event: string, payload: Record<string, unknown>) {
  try {
    const { data: hooks } = await supabase
      .from('webhooks')
      .select('id, url, events')
      .eq('user_id', userId)

    if (!hooks?.length) return

    const matching = hooks.filter(h => (h.events as string[]).includes(event))
    if (!matching.length) return

    await Promise.allSettled(matching.map(async hook => {
      const body = JSON.stringify({ event, timestamp: new Date().toISOString(), ...payload })
      let status = 0
      try {
        const res = await fetch(hook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Bloggy-Event': event },
          body,
          signal: AbortSignal.timeout(10_000),
        })
        status = res.status
      } catch {}

      await supabase
        .from('webhooks')
        .update({ last_triggered_at: new Date().toISOString(), last_status: status })
        .eq('id', hook.id)
    }))
  } catch { /* fire and forget */ }
}
