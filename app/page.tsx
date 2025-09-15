import Link from 'next/link'
export default function Home(){
  return (
    <div className='card space-y-3'>
      <h1 className='text-2xl font-bold'>賞味期限ソート & レシピ提案</h1>
      <p>写真→OCR→編集→保存。レシピは期限が近い順に提案。</p>
      <div className='flex gap-2'>
        <Link className='btn' href='/signin'>サインイン</Link>
        <Link className='btn' href='/dashboard'>ダッシュボード</Link>
      </div>
    </div>
  )
}
