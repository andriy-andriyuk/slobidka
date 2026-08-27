/**
 * Перетворює сирий дамп WordPress (/tmp/slobidka_raw) на чисті JSON-дані сайту.
 * Запуск: node scripts/prepare-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = process.env.RAW_DIR || path.join(ROOT, 'archive');
const SRC = path.join(RAW, 'wordpress-json');
const OUT = path.join(ROOT, 'app', 'data');
fs.mkdirSync(OUT, { recursive: true });

const read = (f) => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));

/* ------------------------------------------------------------------ icons */
const LUCIDE = path.join(ROOT, 'node_modules', 'lucide-static', 'icons');
function lucideBody(name) {
  const svg = fs.readFileSync(path.join(LUCIDE, `${name}.svg`), 'utf8');
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
    .replace(/\s+/g, ' ').trim();
}

// FontAwesome (стара тема) -> Lucide (нова іконографіка)
const FA_MAP = {
  'fa-ban': 'ban', 'fa-briefcase': 'briefcase', 'fa-bullhorn': 'megaphone',
  'fa-camera': 'camera', 'fa-check': 'check', 'fa-clock-o': 'clock',
  'fa-cogs': 'settings', 'fa-compress': 'shrink', 'fa-crosshairs': 'crosshair',
  'fa-envelope-o': 'mail', 'fa-exclamation': 'triangle-alert', 'fa-expand': 'maximize',
  'fa-external-link': 'external-link', 'fa-file-o': 'file', 'fa-file-text-o': 'file-text',
  'fa-flag': 'flag', 'fa-gavel': 'gavel', 'fa-leaf': 'leaf', 'fa-map-marker': 'map-pin',
  'fa-microphone': 'mic', 'fa-minus-circle': 'circle-minus', 'fa-percent': 'percent',
  'fa-random': 'shuffle', 'fa-refresh': 'rotate-cw', 'fa-retweet': 'repeat',
  'fa-search': 'search', 'fa-search-plus': 'zoom-in', 'fa-sitemap': 'network',
  'fa-star': 'star', 'fa-tasks': 'list-checks', 'fa-thumbs-o-up': 'thumbs-up',
  'fa-tree': 'trees', 'fa-trophy': 'trophy', 'fa-truck': 'truck',
  'fa-university': 'landmark', 'fa-unlock': 'lock-open', 'fa-usd': 'banknote',
  'fa-user': 'user', 'fa-users': 'users', 'fa-video-camera': 'video', 'fa-yelp': 'map',
  'fa-photo': 'image', 'fa-youtube-play': 'circle-play',
  'fa-chevron-circle-down': 'circle-chevron-down', 'fa-file-pdf-o': 'file-text',
  'fa-share': 'share-2',
};
const EXTRA_ICONS = [
  'droplets', 'land-plot', 'landmark', 'leaf', 'scroll-text', 'gavel', 'globe',
  'arrow-right', 'arrow-left', 'menu', 'x', 'printer', 'download', 'sun', 'moon',
  'message-circle', 'calendar', 'chevron-down', 'file-text', 'chevron-right',
  'external-link', 'scale', 'map-pin', 'circle-alert', 'link', 'circle-play',
];

// Lucide прибрав бренд-іконки — тримаємо власні (заливка, а не обведення)
const BRAND_ICONS = {
  youtube: '<path fill="currentColor" stroke="none" d="M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.3 5 12 5 12 5s-6.3 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.77C5.7 19 12 19 12 19s6.3 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.02V8.98L15.2 12Z"/>',
  facebook: '<path fill="currentColor" stroke="none" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"/>',
  viber: '<path fill="currentColor" stroke="none" d="M12 2C7.4 2 3.6 4.4 3.6 9.3c0 2.6.9 4.6 2.4 5.9v3.4l2.6-1.6c1 .3 2.1.4 3.4.4 4.6 0 8.4-2.4 8.4-7.3S16.6 2 12 2Zm-1.3 4.2c1.7 0 3.1 1.2 3.3 2.8a.6.6 0 1 1-1.2.1 2.1 2.1 0 0 0-2.1-1.7.6.6 0 0 1 0-1.2Zm-2.4 1.9c.3-.1.6 0 .8.2l.9 1.2c.2.3.2.6 0 .8l-.4.4a3.9 3.9 0 0 0 1.9 1.9l.4-.4c.2-.2.6-.2.8 0l1.2.9c.3.2.3.6.2.8-.4.7-1.2 1.2-2 1-2.3-.5-4.3-2.5-4.8-4.8-.2-.8.3-1.6 1-2Z"/>',
};

const iconNames = [...new Set([...Object.values(FA_MAP), ...EXTRA_ICONS])].sort();
const icons = Object.fromEntries(iconNames.map((n) => [n, lucideBody(n)]));
Object.assign(icons, BRAND_ICONS);
fs.writeFileSync(path.join(OUT, 'icons.json'), JSON.stringify(icons));

const SVG_ATTRS = 'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const inlineSvg = (name) => `<svg class="inline-ico" ${SVG_ATTRS} aria-hidden="true">${icons[name]}</svg>`;

/* --------------------------------------------------- PDF, переведені у WebP */
// матеріали відкриваються просто в браузері; оригінали — в archive/print-originals
const PDF_MAP = fs.existsSync(path.join(SRC, 'pdf-map.json'))
  ? JSON.parse(fs.readFileSync(path.join(SRC, 'pdf-map.json'), 'utf8'))
  : {};

/* ------------------------------------------------------------ оригінали */
const MEDIA = path.join(ROOT, 'public', 'media');

/** WordPress зберігав зменшені копії (`-300x300`). Знаходимо повний розмір. */
function fullSize(src) {
  const m = src.match(/^(\/media\/.+)-\d+x\d+(\.[a-z]+)$/i);
  if (!m) return src;
  const candidate = `${m[1]}${m[2]}`;
  return fs.existsSync(path.join(MEDIA, candidate.replace('/media/', ''))) ? candidate : src;
}

/* ------------------------------------------------------------- html clean */
function clean(html) {
  if (!html) return '';
  let h = html;

  // FontAwesome <i> -> inline SVG
  h = h.replace(/<i\s+class="fa\s+(fa-[a-z0-9-]+)"[^>]*>\s*<\/i>/gi,
    (m, fa) => (FA_MAP[fa] ? inlineSvg(FA_MAP[fa]) : ''));
  h = h.replace(/<i\s+class="fa\s+(fa-[a-z0-9-]+)"[^>]*\/>/gi,
    (m, fa) => (FA_MAP[fa] ? inlineSvg(FA_MAP[fa]) : ''));

  // порожні WordPress-абзаци-роздільники
  h = h.replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '');

  // інлайнові стилі та службові атрибути
  h = h.replace(/\s+style="[^"]*"/gi, '');
  h = h.replace(/\s+(?:width|height)="\d+"/gi, '');
  h = h.replace(/\s+(?:srcset|sizes|loading|decoding|frameborder|scrolling)="[^"]*"/gi, '');

  // зображення: ліниве завантаження + оригінал для лайтбокса
  h = h.replace(/<img\s/gi, '<img loading="lazy" decoding="async" ');
  h = h.replace(/<img([^>]*?)src="(\/media\/[^"]+)"/gi, (m, attrs, src) => {
    const full = fullSize(src);
    return full === src ? m : `<img${attrs}src="${src}" data-full="${full}"`;
  });

  // адаптивні вбудовані відео
  h = h.replace(/<iframe([^>]*)><\/iframe>/gi,
    (m, attrs) => `<div class="embed"><iframe${attrs} loading="lazy" allowfullscreen></iframe></div>`);

  // зовнішні посилання відкривати в новій вкладці
  h = h.replace(/<a\s+([^>]*href="https?:\/\/[^"]*"[^>]*)>/gi, (m, attrs) =>
    /target=/.test(attrs) ? `<a ${attrs}>` : `<a ${attrs} target="_blank" rel="noopener noreferrer">`);

  // посилання на PDF -> зображення сторінок
  h = h.replace(
    /<a([^>]*?)href="(\/media\/[^"]+\.pdf)"([^>]*?)>([\s\S]*?)<\/a>/gi,
    (m, pre, href, post, text) => {
      const entry = PDF_MAP[href];
      if (!entry) return m;
      const first = `<a${pre}href="${entry.pages[0]}"${post}>${text}</a>`;
      if (entry.pages.length === 1) return first;
      const links = entry.pages
        .map((p, i) => `<a href="${p}" target="_blank" rel="noopener noreferrer">${i + 1}</a>`)
        .join(', ');
      return `${first} <span class="doc-pages">сторінки: ${links}</span>`;
    },
  );

  // класи WordPress -> власні
  h = h.replace(/class="([^"]*)"/g, (m, cls) => {
    const keep = cls.split(/\s+/).filter((c) =>
      /^(align(left|right|center|none)|inline-ico|embed|doc-pages|wp-block-columns|wp-block-column|wp-block-image|wp-block-quote)$/.test(c));
    return keep.length ? `class="${keep.join(' ')}"` : '';
  });

  return h.replace(/\s{2,}/g, ' ').replace(/>\s+</g, '><').trim();
}

/* ---------------------------------------------------------------- sources */
const rawTimelines = read('timelines.json');
const rawLaws = read('laws.json');
const rawPages = read('pages.json');
const rawPosts = read('timeline-posts.json');
const site = read('site.json');

/* --------------------------------------------------- метадані з бази WP */
// Cool Timeline тримав дати й відео у власних полях, яких не було у HTML
const TL_META = fs.existsSync(path.join(SRC, 'timeline-meta.json'))
  ? JSON.parse(fs.readFileSync(path.join(SRC, 'timeline-meta.json'), 'utf8'))
  : {};

function videoOf(slug) {
  const url = TL_META[slug]?.video;
  if (!url) return null;
  const id = (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/) || [])[1];
  if (!id) return null;
  const thumb = `/media/video/${id}.jpg`;
  return {
    id,
    url,
    thumb: fs.existsSync(path.join(MEDIA, 'video', `${id}.jpg`)) ? thumb : null,
  };
}

/* ---------------------------------------------------------------- laws */
const CAT_ICON = {
  water: 'droplets', earth: 'land-plot', culture: 'landmark',
  eco: 'leaf', constitution: 'scroll-text', criminal: 'gavel', foreign: 'globe',
};
const CAT_ORDER = ['constitution', 'water', 'earth', 'eco', 'culture', 'criminal', 'foreign'];

const laws = rawLaws.items.map((l) => ({
  ...l,
  // «СТАТТЯ 91. СМУГИ ВІДВЕДЕННЯ» у WP лишилась без категорії — це Водний кодекс
  category: l.category || (/СМУГИ ВІДВЕДЕННЯ/.test(l.title) ? 'water' : 'other'),
  title: l.title.replace(/\s+/g, ' ').trim(),
  html: clean(l.html),
}));

// у WP лишилася точна копія однієї статті — ховаємо її зі списків,
// але сторінку зберігаємо, щоб старі посилання не ламалися
const byContent = new Map();
for (const l of laws) {
  const key = `${l.title}::${l.html}`;
  if (byContent.has(key)) l.duplicateOf = byContent.get(key).slug;
  else byContent.set(key, l);
}

// короткий уривок для згорнутого списку
const excerpt = (html) => {
  const text = html.replace(/<[^>]+>/g, ' ')
    .replace(/&#8217;|&#8216;/g, '’').replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, '—').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
  return text.length > 150 ? `${text.slice(0, 150).replace(/[\s,;:.]+\S*$/, '')}…` : text;
};
laws.forEach((l) => { l.excerpt = excerpt(l.html); });

const listed = laws.filter((l) => !l.duplicateOf);

const categories = CAT_ORDER.map((key) => ({
  key,
  ...rawLaws.categories[key],
  icon: CAT_ICON[key],
  count: listed.filter((l) => l.category === key).length,
}));

fs.writeFileSync(path.join(OUT, 'laws.json'), JSON.stringify({ categories, items: laws }, null, 1));

/* ------------------------------------------------------------- timelines */
const postsByPath = Object.fromEntries(rawPosts.map((p) => [p.path, p]));

// частина подій у Cool Timeline вела на PDF/зображення замість власної сторінки —
// доліновуємо їх до відповідного запису за назвою, щоб контент не лишався сиротою
const norm = (s) => s.replace(/[«»"“”'’\u2018\u2019]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const postsByTitle = new Map(rawPosts.map((p) => [norm(p.title), p]));

const timelines = rawTimelines.map((t) => ({
  id: t.id,
  title: t.title,
  path: t.path,
  intro: clean(t.intro),
  events: t.events.map((e, i) => {
    const direct = e.href ? postsByPath[e.href] : null;
    const post = direct || postsByTitle.get(norm(e.title)) || null;
    return {
      n: i + 1,
      year: e.year,
      date: e.date,
      title: e.title.replace(/\s+/g, ' ').trim(),
      icon: FA_MAP[e.icon] || 'circle-alert',
      href: e.href,
      external: !!e.external,
      // окрема сторінка події (навіть якщо в стрічці посилання вело на файл)
      page: post ? post.path : null,
      hasPage: !!post,
      iso: post ? (TL_META[post.slug]?.iso ?? null) : null,
      video: post ? videoOf(post.slug) : null,
      html: clean(e.html),
    };
  }),
}));
fs.writeFileSync(path.join(OUT, 'timelines.json'), JSON.stringify(timelines, null, 1));

/* --------------------------------------------------------- timeline posts */
const posts = rawPosts.map((p) => ({
  slug: p.slug, path: p.path, title: p.title.replace(/\s+/g, ' ').trim(),
  date: p.date,
  iso: TL_META[p.slug]?.iso ?? null,
  video: videoOf(p.slug),
  stories: p.stories,
  html: clean(p.html),
}));
fs.writeFileSync(path.join(OUT, 'events.json'), JSON.stringify(posts, null, 1));

/* ------------------------------------------------------------------ pages */
// сторінка «Порушені закони» відтворюється зі структурованих даних, а не з HTML-таблиць
const DROP = new Set(['/laws-that-have-been-violated/']);
// сторінки-довідки, що були доступні лише з тіла статей
const CONTEXT = new Set([
  '/київська-влада-коло-змови/',
  '/дабі-інструмент-легалізації-злобудо/',
  '/судова-система-екстрена-служба-порят/',
  '/де-знаходиться-сучасна-микільська-сл/',
  '/аукціон-16-серпня-2017-р-детальніше/',
  '/аукціон-15-грудня-2016-р-детальніше/',
]);
const LEAD = {
  '/київська-влада-коло-змови/': 'Як КМДА та Київрада стали механізмом легалізації незаконних забудов.',
  '/дабі-інструмент-легалізації-злобудо/': 'Роль Державної архітектурно-будівельної інспекції у видачі дозволів.',
  '/судова-система-екстрена-служба-порят/': 'Чому суди роками не можуть вирішити очевидні порушення.',
  '/де-знаходиться-сучасна-микільська-сл/': 'Географія та історія місцевості, про яку йдеться.',
  '/аукціон-16-серпня-2017-р-детальніше/': 'Зупинений аукціон з продажу берега разом із Зоною Здоров’я.',
  '/аукціон-15-грудня-2016-р-детальніше/': 'Схема, за якою Ощадбанк передав землю громади новому власнику.',
};

/** Сторінка «Роздрукуй та пошир» — це список PDF; робимо з нього дані. */
function parseDownloads(html) {
  // після заміни PDF на WebP у html уже стоять посилання на зображення,
  // тому шукаємо їх, а розміри беремо з мапи конвертації
  const re = /<h3>.*?<a href="([^"]+)"[^>]*>(.*?)<\/a>.*?<\/h3><p>\(Розмір: .+?, Формат: .+?\)<\/p>/g;
  const byFirstPage = new Map(
    Object.values(PDF_MAP).map((e) => [e.pages[0], e]),
  );
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    const entry = byFirstPage.get(href);
    out.push({
      href,
      thumb: entry?.thumb ?? href,
      title: m[2].replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').replace(/\s+/g, ' ').trim(),
      width: entry?.width ?? null,
      height: entry?.height ?? null,
      bytes: entry?.bytes ?? null,
    });
  }
  return out;
}

const pages = rawPages
  .filter((p) => !DROP.has(p.path))
  .map((p) => {
    const html = clean(p.html);
    return {
      slug: p.slug,
      path: p.path,
      title: p.title.replace(/\s+/g, ' ').trim(),
      lead: LEAD[p.path] || null,
      context: CONTEXT.has(p.path),
      downloads: p.slug === 'print-and-share' ? parseDownloads(html) : undefined,
      html,
    };
  });
fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 1));

/* ------------------------------------------------------------------- site */
fs.writeFileSync(path.join(OUT, 'site.json'), JSON.stringify({
  name: site.name,
  short: 'Слобідка',
  description: site.description,
  social: [
    { key: 'youtube', icon: 'youtube', label: 'YouTube', title: 'Боротьба за парк на Микільській Слобідці', href: site.social[0]?.href },
    { key: 'facebook', icon: 'facebook', label: 'Facebook', title: 'Спільнота «Микільська Слобідка»', href: site.social[1]?.href },
    { key: 'viber', icon: 'viber', label: 'Viber', title: 'Спільнота «Захист Берега»', href: site.social[2]?.href },
  ].filter((s) => s.href),
}, null, 1));

/* ------------------------------------------------------------------ звіт */
console.log('icons        :', iconNames.length);
console.log('timelines    :', timelines.length, '/ подій:', timelines.reduce((a, t) => a + t.events.length, 0));
console.log('events pages :', posts.length, '| з відео:', posts.filter((p) => p.video).length,
            '| з точною датою:', posts.filter((p) => p.iso).length);
console.log('laws         :', laws.length, '(у списку:', listed.length + ') / категорій:', categories.length);
console.log('pages        :', pages.length, '(контекстних:', pages.filter((p) => p.context).length + ')');
console.log('файлів PDF   :', pages.find((p) => p.downloads)?.downloads.length ?? 0);
const linked = new Set(timelines.flatMap((t) => t.events.map((e) => e.page).filter(Boolean)));
const orphans = posts.filter((p) => !linked.has(p.path));
console.log('без стрічки  :', orphans.length, orphans.map((o) => o.slug).join(', ') || '—');
console.log('→', OUT);
