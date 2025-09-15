'use client'
import { createWorker } from 'tesseract.js'
const workerP = (async()=>{ const w = await createWorker(); await w.loadLanguage('jpn+eng'); await w.initialize('jpn+eng'); return w })()
export async function ocrImage(file: File){ const w = await workerP; const { data } = await w.recognize(file); return data.text || '' }
