'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const requestedRole = formData.get('requestedRole') as string
  
  if (!email || !password || !name) {
    return { error: 'Name, email, and password are required' }
  }
  
  const isStudentRole = !requestedRole || requestedRole === 'STUDENT'
  if (isStudentRole && !email.endsWith('@nssce.ac.in') && email !== 'eventsnssce@gmail.com') {
    return { error: 'Students must use an @nssce.ac.in email address.' }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  if (requestedRole && requestedRole !== 'STUDENT') {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const adminClient = createAdminClient()
      await adminClient
        .from('users')
        .update({ requested_role: requestedRole })
        .eq('id', user.id)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
