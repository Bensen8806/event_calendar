import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HodRequests() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*, departments(id)')
    .eq('id', user.id)
    .single()
    
  const deptId = (profile?.departments as { id: string })?.id

  // Fetch pending events for venues belonging to this HoD's department
  const { data: events } = await supabase
    .from('events')
    .select('*, clubs(name), venues!inner(name, department_id)')
    .eq('status', 'PENDING_HOD')
    .eq('venues.department_id', deptId)

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Pending Venue Requests</h1>
      {events && events.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-card p-6 rounded-lg shadow-sm border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-sm text-muted-foreground">Club: {(event.clubs as { name: string })?.name}</p>
                <p className="text-sm">Venue: {(event.venues as { name: string })?.name}</p>
                <p className="text-sm">Date: {new Date(event.start_time).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md">Reject</button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Approve</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No pending requests for your department venues.</p>
      )}
    </div>
  )
}
