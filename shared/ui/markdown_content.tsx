import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ServerImage } from "@/components/ui/server-image"
import { normalizeHref } from "@/lib/utils/text-utils"
import "katex/dist/katex.min.css"

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const processedContent = content.replace(/(\s)\$(\s)/g, "$1\\$$2")

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false, output: "html" }]]}
        className={cn("prose prose-invert max-w-none", className)}
        components={{
          h1: (props) => <h1 className="text-3xl font-bold mb-6 text-[#00AEC7]" {...props} />,
          h2: (props) => (
            <div className="relative mb-6 mt-10">
              <h2 className="text-2xl font-bold text-[#FFF32A] pb-2 border-b border-[#00AEC7]/30" {...props} />
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-[#FFF32A] to-[#00AEC7]"></div>
            </div>
          ),
          h3: (props) => (
            <h3
              className="text-xl font-semibold mb-3 mt-6 text-[#00AEC7] pl-2 border-l-4 border-[#FFF32A]"
              {...props}
            />
          ),
          p: (props) => <p className="mb-4 text-white" {...props} />,
          a: ({ href, ...props }) => {
            const normalizedHref = href ? normalizeHref(href) : undefined
            const isExternal = normalizedHref?.startsWith("http")

            return (
              <a
                href={normalizedHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-[#00AEC7] hover:underline"
                {...props}
              />
            )
          },
          blockquote: (props) => (
            <blockquote
              className="p-4 bg-black/5 rounded-lg my-6 border-[#00AEC7]/30 border-l-4"
              style={{
                borderImage: "linear-gradient(to bottom, #FFF32A, #00AEC7) 1",
                borderImageSlice: "0 0 0 1",
              }}
              {...props}
            />
          ),
          ul: (props) => <ul className="list-disc pl-5 mb-4 text-white" {...props} />,
          ol: (props) => <ol className="list-decimal pl-5 mb-4 text-white" {...props} />,
          hr: (props) => <hr className="my-8 border-[#00AEC7]/30" {...props} />,
          img: ({ src, alt }) => (
            <ServerImage
              src={src || "/placeholder.svg"}
              alt={alt || "Article image"}
              width={1200}
              height={675}
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="w-full h-auto rounded-lg my-4"
            />
          ),
          strong: (props) => <strong className="font-bold text-[#7FDBFF]" {...props} />,
          em: (props) => <em className="italic text-[#00AEC7]" {...props} />,
          code: ({ inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-black/20 px-1 py-0.5 rounded text-[#FFF32A]" {...props}>
                  {children}
                </code>
              )
            }

            const match = /language-(\w+)/.exec(className || "")
            const language = match ? match[1] : "text"

            return <CodeBlock language={language}>{String(children).replace(/\n$/, "")}</CodeBlock>
          },
          table: (props) => (
            <div
              className="my-6 overflow-x-auto rounded-lg"
              style={{
                borderWidth: "4px",
                borderStyle: "solid",
                borderImage: "linear-gradient(to right, #FFF32A, #00AEC7) 1",
              }}
            >
              <table className="w-full border-collapse bg-black/20" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-gradient-to-r from-[#FFF32A]/20 to-[#00AEC7]/20" {...props} />,
          th: (props) => (
            <th className="p-3 text-left text-[#FFF32A] font-bold border-b border-[#00AEC7]/50" {...props} />
          ),
          td: (props) => <td className="p-3 border-b border-[#00AEC7]/30 text-white" {...props} />,
          tr: (props) => <tr className="hover:bg-black/30 transition-colors" {...props} />,
        }}
      >
        {processedContent}
      </ReactMarkdown>

    </div>
  )
}

interface CodeBlockProps {
  language: string
  children: string
}

function CodeBlock({ language, children }: CodeBlockProps) {
  const displayLanguage =
    {
      py: "Python",
      python: "Python",
      js: "JavaScript",
      javascript: "JavaScript",
      ts: "TypeScript",
      typescript: "TypeScript",
      jsx: "React JSX",
      tsx: "React TSX",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      bash: "Bash",
      sh: "Shell",
      sql: "SQL",
      cpp: "C++",
      c: "C",
      java: "Java",
      go: "Go",
      rust: "Rust",
      php: "PHP",
      ruby: "Ruby",
      swift: "Swift",
      kotlin: "Kotlin",
      dart: "Dart",
      r: "R",
      text: "Text",
    }[language.toLowerCase()] ||
    language ||
    "Text"

  const headerBgClass =
    language.toLowerCase() === "python" || language.toLowerCase() === "py"
      ? "from-[#00AEC7]/90 to-[#00AEC7]/70"
      : language.toLowerCase() === "text" || !language
        ? "from-gray-700 to-gray-800"
        : "from-[#00AEC7]/90 to-[#00AEC7]/70"

  return (
    <div className="relative my-6 rounded-lg overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${headerBgClass} text-white`}>
        <Terminal size={16} />
        <span className="text-sm font-medium">{displayLanguage}</span>
      </div>
      <pre className="overflow-x-auto rounded-b-lg border border-[#00AEC7]/30 bg-black/80 p-4 text-sm text-white">
        <code>{children}</code>
      </pre>
    </div>
  )
}
