"use client"

import { useState, useEffect, useRef } from "react"

interface WordCounterProps {
  text: string
  minWords?: number
  onChange?: (isValid: boolean) => void
}

export function WordCounter({ text, minWords = 10, onChange }: WordCounterProps) {
  const [wordCount, setWordCount] = useState(0)
  const [wordsRemaining, setWordsRemaining] = useState(minWords)
  const lastTextRef = useRef<string>(text)
  const lastValidStateRef = useRef<boolean>(false)

  // Initialize validation state and word count on mount
  useEffect(() => {
    // Count words by splitting on whitespace and filtering out empty strings
    const words = text.trim().split(/\s+/).filter(Boolean)
    const count = words.length

    // Calculate words remaining
    const remaining = Math.max(0, minWords - count)

    // Update state
    setWordCount(count)
    setWordsRemaining(remaining)

    // Update validation state
    if (onChange) {
      const isValid = count >= minWords
      lastValidStateRef.current = isValid
      onChange(isValid)
    }
  }, [])

  useEffect(() => {
    // Count words by splitting on whitespace and filtering out empty strings
    const words = text.trim().split(/\s+/).filter(Boolean)
    const count = words.length

    // Calculate words remaining
    const remaining = Math.max(0, minWords - count)

    // Update state
    setWordCount(count)
    setWordsRemaining(remaining)

    // Update lastTextRef to avoid unnecessary re-renders
    lastTextRef.current = text

    // Call onChange with validity only if the validity state changed
    if (onChange) {
      const isValid = count >= minWords
      if (isValid !== lastValidStateRef.current) {
        lastValidStateRef.current = isValid
        onChange(isValid)
      }
    }
  }, [text, minWords, onChange])

  return (
    <div className="flex justify-end text-xs mt-1">
      {wordsRemaining > 0 && (
        <span className="text-amber-500">
          {wordsRemaining} more word{wordsRemaining !== 1 ? "s" : ""} needed
        </span>
      )}
    </div>
  )
}
