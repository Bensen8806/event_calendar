import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'

export default async function ClubDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('head_user_id', user.id)
    .single()

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/club/new-event">
            <Button>Create Post / Event</Button>
          </Link>
          <Link href="/map">
            <Button variant="outline">View College Map</Button>
          </Link>
          <form action={logout}>
            <Button type="submit" variant="destructive">Log out</Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
          <p><strong>Name:</strong> {profile?.name}</p>
          <p><strong>Email:</strong> {profile?.email}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Club Details</h2>
          {club ? (
            <>
              <p><strong>Club Name:</strong> {club.name}</p>
              <p><strong>Type:</strong> {club.type}</p>
            </>
          ) : (
            <p className="text-muted-foreground">No club assigned yet.</p>
          )}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Past Events</h2>
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <p className="text-muted-foreground">No past events found.</p>
      </div>
    </div>
  )
}
