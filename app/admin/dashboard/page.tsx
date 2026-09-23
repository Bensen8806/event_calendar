import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { approveRoleRequest, rejectRoleRequest } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
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

  const adminClient = createAdminClient()
  const { data: pendingRequests } = await adminClient
    .from('users')
    .select('id, name, email, requested_role')
    .not('requested_role', 'is', null)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action={logout}>
          <Button type="submit" variant="destructive">Log out</Button>
        </form>
      </div>
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Roles:</strong> {profile?.role?.join(', ')}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Pending Role Requests</h2>
        {pendingRequests && pendingRequests.length > 0 ? (
          <div className="grid gap-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-card p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-semibold text-lg">{req.name}</p>
                  <p className="text-muted-foreground">{req.email}</p>
                  <p className="mt-2">
                    Requested Role: <span className="font-bold text-primary">{req.requested_role}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={approveRoleRequest.bind(null, req.id, req.requested_role)}>
                    <Button type="submit">Approve</Button>
                  </form>
                  <form action={rejectRoleRequest.bind(null, req.id)}>
                    <Button type="submit" variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10">Reject</Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No pending requests at the moment.</p>
        )}
      </div>
    </div>
  )
}
