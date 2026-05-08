import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"

const roots = [
  "translations",
  "app/articles/content",
  "app/articles/utils/articles-metadata.ts",
]

const textExtensions = new Set([".json", ".md", ".ts", ".tsx"])
const corruptPattern = /\uFFFD|�/

async function collectFiles(target) {
  const fileStat = await stat(target)
  if (fileStat.isFile()) return [target]

  const entries = await readdir(target, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const next = path.join(target, entry.name)
      return entry.isDirectory() ? collectFiles(next) : [next]
    }),
  )
  return files.flat()
}

const files = (await Promise.all(roots.map(collectFiles)))
  .flat()
  .filter((file) => textExtensions.has(path.extname(file)))

const failures = []

for (const file of files) {
  const content = await readFile(file, "utf8")
  if (!corruptPattern.test(content)) continue

  content.split(/\r?\n/).forEach((line, index) => {
    if (corruptPattern.test(line)) {
      failures.push(`${file}:${index + 1}: ${line.trim()}`)
    }
  })
}

if (failures.length > 0) {
  console.error("Replacement-character corruption found:")
  console.error(failures.join("\n"))
  process.exit(1)
}

console.log("Text integrity check passed")
