import fs from "fs"
import path from "path"

export async function loadMarkdownFile(slug: string): Promise<string> {
  try {
    // Define the path to the markdown file
    const filePath = path.join(process.cwd(), "app", "articles", "content", `${slug}.md`)

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Markdown file not found: ${filePath}`)
    }

    // Read the file
    const content = fs.readFileSync(filePath, "utf8")
    return content
  } catch (error) {
    console.error(`Error loading markdown file for ${slug}:`, error)
    return `# Error Loading Content

Unfortunately, we couldn't load the article content. Please try again later.`
  }
}
