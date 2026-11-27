// Renders assets/terminal.svg: an animated terminal for the GitHub profile.
// `whoami` types out, then a neofetch-style card prints: pixel logo on the left, facts on the right.
// Edit LOGO or INFO, then run: node scripts/terminal-svg.ts
import { writeFileSync } from "node:fs"

type Span = { text: string; cls?: string }
type Row = { label?: string; value: Array<Span> }

const LOGO = [
  "##.....##",
  "###...###",
  "####.####",
  "##.###.##",
  "##..#..##",
  "##.....##",
  "##.....##",
  "##.....##",
  "##.....##"
]

const INFO: Array<Row> = [
  { label: "name", value: [{ text: "marko marinović" }] },
  { label: "role", value: [{ text: "software engineer in fintech, AI and blockchain" }] },
  { label: "now", value: [{ text: "cto & co-founder @ " }, { text: "blank", cls: "acc" }] },
  { value: [{ text: "staff engineer @ " }, { text: "lisk", cls: "acc" }] },
  { label: "building", value: [{ text: "AI-native fintech with swarms of agents" }] },
  { label: "stack", value: [{ text: "typescript · effect · react · next.js" }] },
  { value: [{ text: "c# · solidity · postgres · aws" }] },
  { label: "uptime", value: [{ text: "2 marathons, best 3:18" }] },
  { label: "crypto", value: [{ text: "still cool", cls: "ok" }] },
  { label: "web", value: [{ text: "markomarinovic.com", cls: "acc" }] }
]

const SWATCHES = ["#ff7b72", "#ffa657", "#e3b341", "#3fb950", "#39c5cf", "#58a6ff", "#bc8cff", "#f778ba"]

const W = 820, LEFT = 24, CHAR = 8.43, TOP = 64
const CELL = 22, GAP = 3
const INFO_X = LEFT + LOGO[0].length * CELL + 40, VALUE_X = INFO_X + 84, ROW = 24
const CMD = "whoami", START = 0.5, TYPE = 0.08

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const at = (s: number) => `animation-delay:${s.toFixed(2)}s`
const prompt = (s: number, y: number, body = "") =>
  `<text x="${LEFT}" y="${y}"><tspan class="show" style="${at(s)}"><tspan class="p">➜</tspan> <tspan class="d">~</tspan> </tspan>${body}</text>`

// 1. The prompt appears and `whoami` types out.
const out: Array<string> = []
const typed = [...CMD].map((c, i) => `<tspan style="${at(START + 0.3 + i * TYPE)}">${esc(c)}</tspan>`).join("")
out.push(prompt(START, TOP, `<tspan class="c">${typed}</tspan>`))
let t = START + 0.3 + CMD.length * TYPE + 0.45

// 2. The logo sweeps in diagonally while the card prints line by line.
const cardTop = TOP + 26
const logoTop = cardTop + 40
const logo: Array<string> = []
LOGO.forEach((row, r) =>
  [...row].forEach((cell, c) => {
    if (cell !== "#") return
    logo.push(`<rect class="px" x="${LEFT + c * CELL}" y="${logoTop + r * CELL}" width="${CELL - GAP}" height="${CELL - GAP}" rx="3" style="${at(t + (r + c) * 0.035)}"/>`)
  })
)

let y = cardTop + 12
const card: Array<string> = []
const line = (body: string, x = INFO_X) => {
  card.push(`<text x="${x}" y="${y}" class="show slide" style="${at(t)}">${body}</text>`)
}
line(`<tspan class="acc b">marko</tspan><tspan class="dim">@</tspan><tspan class="acc b">blank</tspan>`)
t += 0.07; y += ROW - 4
line(`<tspan class="dim">${"─".repeat(11)}</tspan>`)
t += 0.07; y += ROW
for (const row of INFO) {
  const value = row.value.map((s) => `<tspan class="${s.cls ?? "o"}">${esc(s.text)}</tspan>`).join("")
  card.push(`<g class="show slide" style="${at(t)}">${row.label ? `<text x="${INFO_X}" y="${y}" class="k">${row.label}</text>` : ""}<text x="${VALUE_X}" y="${y}">${value}</text></g>`)
  t += 0.07; y += ROW
}
y += 4
const swatches = SWATCHES.map((fill, i) =>
  `<rect class="show" x="${INFO_X + i * 26}" y="${y - 14}" width="22" height="14" rx="2" fill="${fill}" style="${at(t + i * 0.04)}"/>`
).join("")
t += SWATCHES.length * 0.04 + 0.4
y += ROW + 10

// 3. A fresh prompt with a blinking cursor.
const lastY = Math.max(y, logoTop + LOGO.length * CELL + ROW + 14)
out.push(prompt(t, lastY))
const cursorX = LEFT + 4 * CHAR + 2
const H = lastY + 22

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Terminal: whoami — Marko Marinović, software engineer in fintech, AI and blockchain">
<defs>
<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="${LEFT}" y1="${logoTop}" x2="${LEFT + LOGO[0].length * CELL}" y2="${logoTop + LOGO.length * CELL}">
<stop offset="0" stop-color="#ff7b72"/><stop offset=".5" stop-color="#d2a8ff"/><stop offset="1" stop-color="#58a6ff"/>
</linearGradient>
<radialGradient id="glow" cx=".2" cy=".45" r=".5"><stop offset="0" stop-color="#d2a8ff" stop-opacity=".09"/><stop offset="1" stop-color="#d2a8ff" stop-opacity="0"/></radialGradient>
</defs>
<style>
text{font:14px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#c9d1d9}
.show,.c tspan,.px{opacity:0;animation:in .01s ease forwards}
.slide{animation:slide .25s ease-out forwards}
.px{fill:url(#g);animation:pop .3s ease-out forwards;transform-box:fill-box;transform-origin:center}
.p{fill:#3fb950} .d{fill:#58a6ff} .c{fill:#e6edf3;font-weight:600} .o{fill:#c9d1d9} .k{fill:#d2a8ff;font-weight:600}
.acc{fill:#79c0ff} .ok{fill:#3fb950} .dim{fill:#6e7681} .b{font-weight:700}
.t{font:12px ui-monospace,Menlo,monospace;fill:#7d8590}
.cur{fill:#e6edf3;opacity:0;animation:in 0s ${t.toFixed(2)}s forwards,blink 1s steps(1) ${t.toFixed(2)}s infinite}
@keyframes in{to{opacity:1}}
@keyframes slide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
@keyframes pop{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:none}}
@keyframes blink{50%{opacity:0}}
</style>
<rect width="${W}" height="${H}" rx="10" fill="#0d1117" stroke="#30363d"/>
<rect width="${W}" height="${H}" rx="10" fill="url(#glow)"/>
<rect width="${W}" height="34" rx="10" fill="#161b22"/><rect y="24" width="${W}" height="10" fill="#161b22"/>
<circle cx="20" cy="17" r="6" fill="#ff5f57"/><circle cx="40" cy="17" r="6" fill="#febc2e"/><circle cx="60" cy="17" r="6" fill="#28c840"/>
<text class="t" x="${W / 2}" y="21" text-anchor="middle">marko@blank: ~</text>
${out[0]}
${logo.join("\n")}
${card.join("\n")}
${swatches}
${out[1]}
<rect class="cur" x="${cursorX.toFixed(0)}" y="${lastY - 13}" width="8" height="16"/>
</svg>
`
writeFileSync(new URL("../assets/terminal.svg", import.meta.url), svg)
console.log(`assets/terminal.svg: ${INFO.length} rows, ${t.toFixed(1)} s, ${W}x${H}`)
