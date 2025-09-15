'use client'
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { RULES } from '@/app/recipes/rules'

type Row={name:string,expiry_date:string|null,ingredients:string[]}
export default function Recipes(){
  const [items,setItems]=useState<Row[]>([])
  useEffect(()=>{ supabase.auth.getUser().then(async ({data})=>{ if(!data.user){ location.href='/signin'; return } const { data:rows } = await supabase.from('items').select('name,expiry_date,ingredients'); setItems(rows||[]) }) },[])
  const urgencyByIng=useMemo(()=>{ const m=new Map<string,number>(); const today=new Date().setHours(0,0,0,0); for(const it of items){ if(!it.expiry_date) continue; const d=new Date(it.expiry_date).setHours(0,0,0,0); const left=Math.floor((d-today)/86400000); for(const ing of it.ingredients||[]){ m.set(ing, Math.min(left, m.get(ing) ?? left)) } } return m },[items])
  const haveSet=useMemo(()=>{ const s=new Set<string>(); for(const it of items) for(const ing of it.ingredients||[]) s.add(ing); return s },[items])
  const suggestions=useMemo(()=>{ const arr=(RULES.map(r=>{ const hit=r.need.filter(n=>haveSet.has(n)); if(!hit.length) return null; let bonus=0; for(const h of hit){ const dl=urgencyByIng.get(h) ?? 30; bonus += Math.max(0,(30-dl)/30) } const score=hit.length+bonus; const soonest=Math.min(...hit.map(h=> urgencyByIng.get(h) ?? 365)); return { ...r, hitCount:hit.length, score, soonest } }).filter(Boolean) as any[]); arr.sort((a,b)=> (a.soonest-b.soonest) || (b.score-a.score)); return arr },[haveSet,urgencyByIng])
  return (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>レシピ提案（期限が近い順）</h1>
      <div className='grid md:grid-cols-2 gap-4'>
        {suggestions.map((r,i)=> (
          <div key={i} className='card'>
            <div className='text-xs text-slate-500'>必要: {r.need.join(', ')}</div>
            <div className='text-lg font-bold'>{r.name}</div>
            <div className='text-slate-700'>{r.how}</div>
            <div className='text-xs text-slate-500 mt-2'>緊急度: 最短 {r.soonest} 日</div>
          </div>
        ))}
        {suggestions.length===0 && <div className='card'>該当なし。食材を追加してください。</div>}
      </div>
    </div>
  )
}
