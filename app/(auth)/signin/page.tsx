'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
export default function SignIn(){
  const [email,setEmail] = useState('')
  const [sent,setSent] = useState(false)
  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: typeof window!=='undefined'? window.location.origin + '/dashboard' : undefined } })
    if(error) alert(error.message); else setSent(true)
  }
  return (
    <div className='card space-y-4'>
      <h1 className='text-xl font-bold'>サインイン</h1>
      {sent? <p>メールのリンクを確認してください。</p> : (
        <form onSubmit={onSubmit} className='space-y-3'>
          <input className='input' placeholder='you@example.com' value={email} onChange={e=>setEmail(e.target.value)} />
          <button className='btn'>メールでログイン</button>
        </form>
      )}
    </div>
  )
}
