'use client'
import { useEffect, useState } from 'react'
import { ocrImage } from './Ocr'
import { supabase } from '@/app/lib/supabaseClient'

type Row = { file:File, preview:string, name:string, expiry:string, ingredients:string, raw:string }

function extractExpiry(text: string){
  const norm=(s:string)=> s.replace(/年|\.|-/g,'/').replace(/月/g,'/').replace(/日/g,'')
  const m = norm(text).match(/(\d{2,4})\/(\d{1,2})\/(\d{1,2})/)
  if(!m) return ''
  const y = m[1].length===2 ? String(2000+Number(m[1])) : m[1]
  return `${y}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`
}
function guessName(text:string){ return (text.split(/\n/).map(s=>s.trim()).find(s=> s.length>=2) || '食品').slice(0,30) }
function extractIngredients(text:string){
  const vocab=['卵','牛乳','豆腐','納豆','味噌','ねぎ','玉ねぎ','トマト','キャベツ','レタス','にんじん','じゃがいも','鶏肉','豚肉','牛肉','ベーコン','ハム','ソーセージ','ヨーグルト','チーズ','パン','米','パスタ','うどん','そば','ツナ','しめじ','えのき','しいたけ','まいたけ','小松菜','ピーマン','なす','キムチ','バター','砂糖','塩','醤油','みりん','酒','ごま油','オリーブオイル','にんにく','生姜']
  const set=new Set<string>(); for(const w of vocab){ if(text.includes(w)) set.add(w) } return Array.from(set).join(',')
}

export default function UploadPage(){
  const [rows,setRows] = useState<Row[]>([])
  const [saving,setSaving]=useState(false)
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>{ if(!data.user) location.href='/signin' }) },[])
  async function onFiles(e:React.ChangeEvent<HTMLInputElement>){
    const files=Array.from(e.target.files||[]); const next:Row[]=[]
    for(const f of files){ const raw=await ocrImage(f); next.push({ file:f, preview:URL.createObjectURL(f), name:guessName(raw), expiry:extractExpiry(raw), ingredients:extractIngredients(raw), raw }) }
    setRows(next)
  }
  async function saveAll(){
    setSaving(true); const { data:{ user } } = await supabase.auth.getUser(); if(!user){ alert('ログインしてください'); setSaving(false); return }
    for(const r of rows){ let image_url:string|null=null; if(r.file){ const path=`u${user.id}/${Date.now()}_${r.file.name}`; const { error } = await supabase.storage.from('images').upload(path,r.file); if(!error){ const { data:pub } = supabase.storage.from('images').getPublicUrl(path); image_url = pub?.publicUrl ?? null } }
      await supabase.from('items').insert({ user_id:user.id, name:r.name, ingredients:r.ingredients? r.ingredients.split(',').map(s=>s.trim()):[], expiry_date:r.expiry||null, image_url, raw_text:r.raw })
    }
    setSaving(false); alert('保存しました'); location.href='/dashboard'
  }
  return (
    <div className='space-y-4'>
      <h1 className='text-xl font-bold'>写真をアップロード</h1>
      <input type='file' accept='image/*' multiple onChange={onFiles}/>
      {rows.length>0 && (
        <div className='card overflow-auto'>
          <table className='table'>
            <thead><tr><th>画像</th><th>品名</th><th>食材（カンマ区切り）</th><th>賞味期限</th><th>元テキスト</th></tr></thead>
            <tbody>
              {rows.map((r,i)=> (
                <tr key={i} className='border-t align-top'>
                  <td><img src={r.preview} className='h-16 w-16 object-cover rounded-lg'/></td>
                  <td><input className='input' value={r.name} onChange={e=> setRows(s=> s.map((x,j)=> j===i?{...x,name:e.target.value}:x))}/></td>
                  <td><input className='input' value={r.ingredients} onChange={e=> setRows(s=> s.map((x,j)=> j===i?{...x,ingredients:e.target.value}:x))}/></td>
                  <td><input className='input' type='date' value={r.expiry} onChange={e=> setRows(s=> s.map((x,j)=> j===i?{...x,expiry:e.target.value}:x))}/></td>
                  <td><textarea className='input' value={r.raw} onChange={e=> setRows(s=> s.map((x,j)=> j===i?{...x,raw:e.target.value}:x))}/></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='mt-3'><button className='btn' disabled={saving} onClick={saveAll}>{saving?'保存中...':'保存'}</button></div>
        </div>
      )}
    </div>
  )
}
