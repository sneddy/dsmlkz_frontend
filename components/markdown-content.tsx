"use client"
import { useState, useCallback, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { Check, Copy, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import "katex/dist/katex.min.css"

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  // Предварительная обработка контента для исправления LaTeX выражений
  const processedContent = useMemo(() => {
    // Защищаем блочные формулы от изменений, заменяя их на временные маркеры
    const blockFormulas = []
    let processed = content.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
      blockFormulas.push(formula)
      return `BLOCK_FORMULA_${blockFormulas.length - 1}`
    })

    // Защищаем inline формулы от изменений
    const inlineFormulas = []
    processed = processed.replace(/\$([^$\n]+?)\$/g, (match, formula) => {
      inlineFormulas.push(formula)
      return `INLINE_FORMULA_${inlineFormulas.length - 1}`
    })

    // Заменяем буквальные строки "$<latex expression>$" на заполнитель
    processed = processed.replace(/\$<latex expression>\$/g, "PLACEHOLDER_FORMULA")

    // Восстанавливаем блочные формулы
    processed = processed.replace(/BLOCK_FORMULA_(\d+)/g, (match, index) => {
      return `$$${blockFormulas[Number.parseInt(index)]}$$`
    })

    // Восстанавливаем inline формулы
    processed = processed.replace(/INLINE_FORMULA_(\d+)/g, (match, index) => {
      return `$${inlineFormulas[Number.parseInt(index)]}$`
    })

    // Восстанавливаем заполнители
    processed = processed.replace(/PLACEHOLDER_FORMULA/g, "$$\\text{[LaTeX формула]}$$")

    return processed
  }, [content])

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
          a: (props) => <a className="text-[#00AEC7] hover:underline" {...props} />,
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
          img: ({ src, alt, ...props }) => (
            <img src={src || "/placeholder.svg"} alt={alt} className="w-full h-auto rounded-lg my-4" {...props} />
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
            const language = match ? match[1] : ""

            return <CodeBlock language={language}>{String(children).replace(/\n$/, "")}</CodeBlock>
          },
          // Добавляем улучшенные стили для таблиц
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

      {/* Добавляем стили для KaTeX */}
      <style jsx global>{`
        .katex-display {
          margin: 1.5rem 0;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 0.5rem 0;
        }
        .katex {
          font-size: 1.1em;
        }
        .katex-display > .katex {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

interface CodeBlockProps {
  language: string
  children: string
}

function CodeBlock({ language, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  // Получаем название языка для отображения
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
    "Code"

  return (
    <div className="relative my-6 rounded-lg overflow-hidden">
      {/* Заголовок с языком и кнопкой копирования */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#00AEC7]/90 to-[#00AEC7]/70 text-white">
        <div className="flex items-center gap-2">
          <Terminal size={16} />
          <span className="text-sm font-medium">{displayLanguage}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs py-1 px-2 rounded hover:bg-white/10 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Блок кода с подсветкой синтаксиса */}
      <SyntaxHighlighter
        language={language || "text"}
        style={atomDark}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: "0 0 0.5rem 0.5rem",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          fontSize: "0.9rem",
          border: "1px solid rgba(0, 174, 199, 0.3)",
        }}
        showLineNumbers={true}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}
