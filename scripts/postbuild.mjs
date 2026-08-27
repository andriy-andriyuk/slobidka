/**
 * Nuxt лишає 404.html порожньою оболонкою, яка малюється лише скриптом.
 * Підміняємо його відрендереною сторінкою /not-found/ і прибираємо її з видачі.
 */
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve('.output/public')
const src = path.join(OUT, 'not-found', 'index.html')
const dest = path.join(OUT, '404.html')

if (!fs.existsSync(src)) {
  console.error('postbuild: не знайдено', src)
  process.exit(1)
}

fs.copyFileSync(src, dest)
fs.rmSync(path.join(OUT, 'not-found'), { recursive: true, force: true })
fs.rmSync(path.join(OUT, '_payload', 'not-found'), { recursive: true, force: true })

console.log(`postbuild: 404.html зібрано з /not-found/ (${Math.round(fs.statSync(dest).size / 1024)} КБ)`)
