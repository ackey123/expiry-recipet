import './globals.css'
export const metadata = { title:'賞味期限 & レシピ', description:'OCRで期限管理とレシピ提案（マルチユーザー）' }
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang='ja'><body className='max-w-6xl mx-auto p-4'>{children}</body></html>
}
