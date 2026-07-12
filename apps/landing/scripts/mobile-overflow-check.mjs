// Headless-browser horizontal-overflow check at mobile widths.
// Loads the running app, scrolls through it (to trigger reveals / the sticky
// hero transition), and reports any horizontal page scroll + the elements that
// extend past the right edge. Exits non-zero if any width overflows.
//
// Usage: node scripts/mobile-overflow-check.mjs
//        URL=http://192.168.1.57:5173/ node scripts/mobile-overflow-check.mjs
import puppeteer from 'puppeteer-core'

const CHROME =
  process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = process.env.URL || 'http://localhost:5173/'
const WIDTHS = [320, 375, 414] // iPhone SE1 · iPhone SE2/12 mini · iPhone Plus
const HEIGHT = 800

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--hide-scrollbars'],
})

let failures = 0

for (const width of WIDTHS) {
  const page = await browser.newPage()
  await page.setViewport({
    width,
    height: HEIGHT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  // 'load' not 'networkidle' — the HMR socket + looping hero video never idle.
  await page.goto(URL, { waitUntil: 'load', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 600))

  // Scroll through the whole page so reveals / sticky stage / lazy media run.
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
    for (let y = 0; y <= document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y)
      await sleep(150)
    }
    window.scrollTo(0, 0)
    await sleep(150)
  })

  const result = await page.evaluate(() => {
    const vw = window.innerWidth
    const overflow = document.documentElement.scrollWidth - vw
    const offenders = []
    if (overflow > 0) {
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.right > vw + 1 && r.width > 0) {
          const cls =
            typeof el.className === 'string' ? el.className : el.getAttribute('class') || ''
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: cls.slice(0, 70),
            right: Math.round(r.right),
            width: Math.round(r.width),
          })
        }
      }
      offenders.sort((a, b) => b.right - a.right)
    }
    return { vw, scrollWidth: document.documentElement.scrollWidth, overflow, offenders: offenders.slice(0, 6) }
  })

  if (result.overflow > 0) {
    failures++
    console.log(`\n[${width}px] scrollWidth=${result.scrollWidth} vw=${result.vw} → OVERFLOW +${result.overflow}px`)
    for (const o of result.offenders) {
      console.log(`   <${o.tag}> right=${o.right} w=${o.width}  ${o.cls}`)
    }
  } else {
    console.log(`\n[${width}px] scrollWidth=${result.scrollWidth} vw=${result.vw} → ok`)
  }
  await page.close()
}

await browser.close()
const clean = WIDTHS.length - failures
console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'}: ${clean}/${WIDTHS.length} widths free of horizontal scroll`)
process.exit(failures === 0 ? 0 : 1)
