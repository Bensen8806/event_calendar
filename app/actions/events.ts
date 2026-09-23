'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitEventRequest(data: {
  title: string
  description: string
  venueId: string
  startIso: string
  endIso: string
  expectedAttendance: number
  category: string
  ktuPoints: boolean
  specialRequirements: string
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: club } = await supabase
    .from('clubs')
    .select('id')
    .eq('head_user_id', user.id)
    .single()

  const { error } = await supabase.from('events').insert({
    title: data.title,
    description: data.description,
    club_id: club?.id || null,
    club_head_id: user.id,
    venue_id: data.venueId,
    start_time: data.startIso,
    end_time: data.endIso,
    expected_attendance: data.expectedAttendance || 0,
    category: data.category || 'TECHNICAL',
    ktu_activity_points_category: data.ktuPoints ? 'YES' : null,
    status: 'PENDING_HOD',
    special_requirements: data.specialRequirements || ''
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/map')
  revalidatePath('/hod/requests')
  return { success: true }
}
