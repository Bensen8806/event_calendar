import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default async function StudentDashboard() {
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <form action={logout}>
          <Button type="submit" variant="destructive">Log out</Button>
        </form>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Participated Events</h2>
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <p className="text-muted-foreground">No events participated yet.</p>
      </div>
    </div>
  )
}
