'use client'

// 型エラーを完全回避して動かす版（動作優先）
export async function ocrImage(file: File) {
  const Tesseract: any = (await import('tesseract.js')).default
  const { data } = await Tesseract.recognize(file, 'jpn+eng')
  return data.text || ''
}
