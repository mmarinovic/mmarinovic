// Renders assets/terminal.svg: an animated terminal session for the GitHub profile.
// Edit SESSION, then run: node scripts/terminal-svg.ts
import { writeFileSync } from "node:fs"

type Span = { text: string; cls?: string }
type Step = { cmd: string } | { out: Array<Span> }

const SESSION: Array<Step> = [
  { cmd: "whoami" },
  { out: [{ text: "marko marinović — software engineer in fintech, AI and blockchain" }] },
  { cmd: "cat now.txt" },
  { out: [{ text: "cto & co-founder @ blank  ·  staff engineer @ lisk" }] },
  { out: [{ text: "building AI-native fintech with swarms of agents" }] },
  { cmd: "ls ~/projects" },
  { out: [{ text: "react2aws/  tailwindsql/  tinybar/  ", cls: "dir" }, { text: "offload/  sessioncast/  snappy/", cls: "new" }, { text: "  ← new", cls: "dim" }] },
  { cmd: "offload pnpm test" },
  { out: [{ text: "✓ 7 tests passed", cls: "ok" }, { text: " on the linux box · my laptop stays cool · exit 0 in 6.9s" }] },
  { cmd: "snappy quick" },
  { out: [{ text: "📸 screenshot + repo, branch, last error → ", cls: "o" }, { text: "claude · working · ~/projects/app", cls: "acc" }] },
  { cmd: "sessioncast latest --mp4" },
  { out: [{ text: "🎬 98 min session → 90 s movie", cls: "o" }, { text: " · 160 commands · 12 commits · confetti", cls: "dim" }] },
  { cmd: "cat stack.txt" },
  { out: [{ text: "typescript · effect · react · next.js · c# · solidity · postgres · aws" }] },
  { cmd: "uptime" },
  { out: [{ text: "2 marathons, best 3:18  ·  crypto is still cool" }] },
  { cmd: "open markomarinovic.com" }
]

const W = 820, LINE = 26, TOP = 64, LEFT = 24, CHAR = 8.43
const TYPE = 0.045, AFTER_CMD = 0.35, AFTER_OUT = 0.12, START = 0.5

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const prompt = `<tspan class="p">➜</tspan> <tspan class="d">~</tspan> `

let t = START
let y = TOP
const lines: Array<string> = []
let cursorX = LEFT
for (const step of SESSION) {
  if ("cmd" in step) {
    // The prompt appears, then the command types out one character at a time.
    const chars = [...step.cmd].map((c, i) => `<tspan style="animation-delay:${(t + 0.25 + i * TYPE).toFixed(2)}s">${esc(c)}</tspan>`).join("")
    lines.push(`<text x="${LEFT}" y="${y}"><tspan class="show" style="animation-delay:${t.toFixed(2)}s">${prompt}</tspan><tspan class="c">${chars}</tspan></text>`)
    cursorX = LEFT + (4 + [...step.cmd].length) * CHAR + 2
    t += 0.25 + step.cmd.length * TYPE + AFTER_CMD
  } else {
    const spans = step.out.map((s) => `<tspan class="${s.cls ?? "o"}">${esc(s.text)}</tspan>`).join("")
    lines.push(`<text x="${LEFT}" y="${y}" class="show" style="animation-delay:${t.toFixed(2)}s">${spans}</text>`)
    t += AFTER_OUT
  }
  y += LINE
}
const H = y + 8
const last = y - LINE

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Terminal: whoami — Marko Marinović, software engineer in fintech, AI and blockchain">
<style>
text{font:14px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;fill:#c9d1d9}
.show,.c tspan{opacity:0;animation:in .01s ease forwards}
.p{fill:#3fb950} .d{fill:#58a6ff} .c{fill:#e6edf3;font-weight:600} .o{fill:#a5afbb} .dir{fill:#d2a8ff}
.new{fill:#ff7b72;font-weight:600} .ok{fill:#3fb950;font-weight:600} .acc{fill:#79c0ff} .dim{fill:#6e7681}
.t{font:12px ui-monospace,Menlo,monospace;fill:#7d8590}
.cur{fill:#e6edf3;opacity:0;animation:in 0s ${t.toFixed(2)}s forwards,blink 1s steps(1) ${t.toFixed(2)}s infinite}
@keyframes in{to{opacity:1}}
@keyframes blink{50%{opacity:0}}
</style>
<rect width="${W}" height="${H}" rx="10" fill="#0d1117" stroke="#30363d"/>
<rect width="${W}" height="34" rx="10" fill="#161b22"/><rect y="24" width="${W}" height="10" fill="#161b22"/>
<circle cx="20" cy="17" r="6" fill="#ff5f57"/><circle cx="40" cy="17" r="6" fill="#febc2e"/><circle cx="60" cy="17" r="6" fill="#28c840"/>
<text class="t" x="${W / 2}" y="21" text-anchor="middle">marko@blank: ~</text>
${lines.join("\n")}
<rect class="cur" x="${cursorX.toFixed(0)}" y="${last - 13}" width="8" height="16"/>
</svg>
`
writeFileSync(new URL("../assets/terminal.svg", import.meta.url), svg)
console.log(`assets/terminal.svg: ${SESSION.length} steps, ${t.toFixed(1)} s, ${W}x${H}`)
