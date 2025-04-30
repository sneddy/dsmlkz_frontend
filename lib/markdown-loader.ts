export async function loadMarkdownFile(path: string): Promise<string> {
  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${path}`)
    }
    return await response.text()
  } catch (error) {
    console.error(`Error loading markdown file ${path}:`, error)
    return "# Ошибка загрузки контента\n\nК сожалению, не удалось загрузить содержимое статьи."
  }
}
