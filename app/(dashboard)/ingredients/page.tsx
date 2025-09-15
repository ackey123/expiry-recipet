'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
export default function Ingredients(){
  const [ings,setIngs]=useState<string[]>([])
  useEffect(()=>{ supabase.auth.getUser().then(async ({data})=>{ if(!data.user){ location.href='/signin'; return } const { data:items } = await supabase.from('items').select('ingredients, expiry_date'); const m=new Map<string,number>(); const today=new Date(); const ms=86400000; for(const it of items||[]){ for(const ing of it.ingredients||[]){ if(!it.expiry_date) continue; const dleft=Math.floor((new Date(it.expiry_date).getTime()-today.getTime())/ms); m.set(ing, Math.min(dleft, m.get(ing) ?? dleft)) } } const sorted=Array.from(m.entries()).sort((a,b)=>a[1]-b[1]).map(([k])=>k); setIngs(sorted) } )},[])
  return (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>食材リスト（期限が近い順）</h1>
      <div className='card'>
        {ings.length? <div className='flex flex-wrap gap-2'>{ings.map(ing=> <span key={ing} className='badge'>{ing}</span>)}</div> : '（まだありません）'}
      </div>
    </div>
  )
}
