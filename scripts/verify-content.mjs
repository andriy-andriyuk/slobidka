/**
 * Перевіряє, що текст зі старого WordPress не загубився під час перенесення.
 * Порівнює слова з archive/wordpress-html із текстом у .output/public.
 *
 * Запуск: npm run generate && node scripts/verify-content.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const RAW = 'archive'
const OUT = '.output/public'

const strip = (h) => h
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#8217;|&#8216;|&rsquo;/g, '’')
  .replace(/&#8220;|&#8221;|&quot;/g, '"')
  .replace(/&#8211;|&#8212;|&ndash;|&mdash;/g, '–')
  .replace(/&nbsp;|&#160;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/[^\p{L}\p{N}]+/gu, ' ')
  .toLowerCase().trim()

// весь текст нового сайту
let siteText = ''
;(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f)
    const st = fs.statSync(p)
    if (st.isDirectory()) { if (f !== 'media' && f !== '_nuxt' && f !== '_fonts') walk(p) }
    else if (f.endsWith('.html')) siteText += ' ' + strip(fs.readFileSync(p, 'utf8'))
  }
})(OUT)
const siteWords = new Set(siteText.split(' '))

const map = fs.readFileSync(path.join(RAW, 'map.tsv'), 'utf8').trim().split('\n').map(l => l.split('\t'))

let worst = []
for (const [key, url] of map) {
  const p = decodeURIComponent(url.replace('https://slobidka.info', ''))
  // архівні сторінки таксономій не відтворюємо окремо — їхній вміст є в списках
  if (p.startsWith('/ctl-stories/') || p.startsWith('/violated_laws_categories/')) continue

  const html = fs.readFileSync(path.join(RAW, 'wordpress-html', key + '.html'), 'utf8')
  const m = html.match(/<div class="entry-content">([\s\S]*?)<\/div><!-- \.entry-content -->/)
    || html.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/)
  if (!m) continue

  const words = [...new Set(strip(m[1]).split(' '))].filter(w => w.length > 3)
  if (words.length < 5) continue
  const missing = words.filter(w => !siteWords.has(w))
  const cover = 1 - missing.length / words.length
  if (cover < 0.995) worst.push({ p, cover, missing: missing.slice(0, 8), total: words.length })
}

worst.sort((a, b) => a.cover - b.cover)
console.log(`перевірено сторінок: ${map.length}`)
console.log(`з утратою слів: ${worst.length}`)
for (const w of worst.slice(0, 12)) {
  console.log(`  ${(w.cover * 100).toFixed(1)}%  ${w.p}  (унікальних слів ${w.total})  ↯ ${w.missing.join(', ')}`)
}
