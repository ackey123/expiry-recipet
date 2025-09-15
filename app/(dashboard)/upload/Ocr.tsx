'use client'
import Tesseract from 'tesseract.js'

// Workerを使わずに直接認識
export async function ocrImage(file: File) {
  const { data } = await Tesseract.recognize(file, 'jpn+eng')
  return data.text || ''
}
