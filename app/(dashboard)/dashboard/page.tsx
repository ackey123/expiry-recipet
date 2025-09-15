'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import dayjs from 'dayjs'
import Link from 'next/link'

type Item = { id:string, name:string, ingredients:string[], expiry_date:string|null, image_url:string|null, note:string|null }

export default function Dashboard(){
  const [items,setItems] = useState<Item[]>([])
  const [user,setUser] = useState<any>(null)
  useEffect(()=>{ supabase.auth.getUser().then(({data})=> setUser(data.user)) },[])
  useEffect(()=>{
    if(!user) return
    supabase.from('items').select('*').order('expiry_date', { ascending: true }).then(({data,error})=>{ if(!error && data) setItems(data as Item[]) })
  },[user])
  async function signout(){ await supabase.auth.signOut(); location.href='/' }
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-bold'>ダッシュボード</h1>
        <div className='flex gap-2'>
          <Link href='/upload' className='btn'>写真をアップロード</Link>
          <Link href='/ingredients' className='btn'>食材リスト</Link>
          <Link href='/recipes' className='btn'>レシピ提案</Link>
          <button onClick={signout} className='btn'>サインアウト</button>
        </div>
      </div>
      <div className='card overflow-auto'>
        <table className='table'>
          <thead><tr><th>画像</th><th>品名</th><th>食材</th><th>期限</th><th>メモ</th></tr></thead>
          <tbody>
            {items.map(it=> (
              <tr key={it.id} className='border-t'>
                <td>{it.image_url? <img src={it.image_url} className='h-16 w-16 object-cover rounded-lg'/> : '-'}</td>
                <td>{it.name}</td>
                <td>{it.ingredients?.join(', ')}</td>
                <td>{it.expiry_date? dayjs(it.expiry_date).format('YYYY-MM-DD') : '-'}</td>
                <td>{it.note || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
