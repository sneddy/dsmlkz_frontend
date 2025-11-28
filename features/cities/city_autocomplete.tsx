"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/use-translation"
import { Spinner } from "@/components/ui/spinner"
import { useSupabase } from "@/contexts/supabase-context"
import { useLanguage } from "@/contexts/language-context"

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  label?: string | React.ReactNode
  required?: boolean
}

interface CityResult {
  priority: number
  city: string
  city_ascii: string
  country: string
  city_ru: string
  country_ru: string
  population: number
}

// Функция для определения, содержит ли строка кириллические символы
function containsCyrillic(text: string): boolean {
  return /[а-яА-ЯёЁәіңғүұқөһӘІҢҒҮҰҚӨҺ]/.test(text)
}

export function CityAutocomplete({ value, onChange, label, required = false }: CityAutocompleteProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { supabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<CityResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  // Заменяем функцию fetchSuggestions на оптимизированную версию
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    const usesCyrillic = containsCyrillic(query)

    setIsLoading(true)

    try {
      let data: CityResult[] = []

      if (usesCyrillic) {
        const [byCity, byCountry] = await Promise.all([
          supabase
            .from("cities_index")
            .select("*")
            .ilike("city_ru", `%${query}%`)
            .order("priority", { ascending: true })
            .limit(10),
          supabase
            .from("cities_index")
            .select("*")
            .ilike("country_ru", `%${query}%`)
            .order("priority", { ascending: true })
            .limit(10),
        ])

        const combined = [...(byCity.data || []), ...(byCountry.data || [])] as CityResult[]
        const seen = new Set<number>()
        data = combined.filter((item: CityResult) => {
          if (seen.has(item.priority || -1)) return false
          seen.add(item.priority)
          return true
        })
      } else {
        const [byAscii, byCity, byCountry] = await Promise.all([
          supabase
            .from("cities_index")
            .select("*")
            .ilike("city_ascii", `%${query}%`)
            .order("priority", { ascending: true })
            .limit(10),
          supabase
            .from("cities_index")
            .select("*")
            .ilike("city", `%${query}%`)
            .order("priority", { ascending: true })
            .limit(10),
          supabase
            .from("cities_index")
            .select("*")
            .ilike("country", `%${query}%`)
            .order("priority", { ascending: true })
            .limit(10),
        ])

        const combined = [...(byAscii.data || []), ...(byCity.data || []), ...(byCountry.data || [])] as CityResult[]
        const seen = new Set<number>()
        data = combined.filter((item: CityResult) => {
          if (seen.has(item.priority || -1)) return false
          seen.add(item.priority)
          return true
        })
      }

      setSuggestions(data)
    } catch (error) {
      console.error("Error in city autocomplete:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Обработчик изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)

    if (newValue.length >= 2) {
      fetchSuggestions(newValue)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Обработчик выбора города из списка
  const handleSelectCity = (result: CityResult) => {
    // Определяем, используем ли мы кириллицу на основе вводимого текста
    const usesCyrillic = containsCyrillic(inputValue)

    // Формируем полное название с городом и страной в зависимости от того, используется ли кириллица
    let locationName = ""

    if (usesCyrillic) {
      locationName = `${result.city_ru}, ${result.country_ru}`
    } else {
      locationName = `${result.city_ascii}, ${result.country}`
    }

    setInputValue(locationName)
    onChange(locationName)
    setSuggestions([])
    setShowSuggestions(false)
  }

  // Закрываем выпадающий список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Обновляем inputValue при изменении value извне
  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <div className="space-y-2">
      <Label htmlFor="city-input">
        {typeof label === "string" ? label : label || t("profile.currentCity")}{" "}
        {required && typeof label === "string" && "*"}
      </Label>
      <div className="relative" ref={suggestionsRef}>
        <Input
          ref={inputRef}
          id="city-input"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue && inputValue.length >= 2) {
              fetchSuggestions(inputValue)
              setShowSuggestions(true)
            }
          }}
          placeholder={t("profile.enterCity")}
          required={required}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-[#00AEC7] rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((result) => {
              // Определяем, используем ли мы кириллицу на основе вводимого текста
              const usesCyrillic = containsCyrillic(inputValue)

              // Определяем название города/страны в зависимости от того, используется ли кириллица
              const cityName = usesCyrillic ? result.city_ru : result.city_ascii
              const countryName = usesCyrillic ? result.country_ru : result.country

              return (
                <div
                  key={result.priority}
                  className="px-4 py-2 cursor-pointer hover:bg-[#00AEC7]/10 transition-colors"
                  onClick={() => handleSelectCity(result)}
                >
                  <div className="font-medium text-black">{cityName}</div>
                  <div className="text-sm text-gray-600">{countryName}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
