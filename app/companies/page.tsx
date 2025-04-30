"use client"

import { useState } from "react"
import { useTranslation } from "@/hooks/use-translation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CompaniesPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("bigtech")

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2 font-pixel text-[#FFF32A] text-center">
          {t("nav.companies") || "Компании"}
        </h1>
      </div>

      <Tabs defaultValue="bigtech" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="bigtech">Бигтех</TabsTrigger>
          <TabsTrigger value="startups">Стартапы</TabsTrigger>
          <TabsTrigger value="labs">Лаборатории</TabsTrigger>
        </TabsList>

        <TabsContent value="bigtech">{/* Содержимое для Бигтех */}</TabsContent>

        <TabsContent value="startups">{/* Содержимое для Стартапы */}</TabsContent>

        <TabsContent value="labs">{/* Содержимое для Лаборатории */}</TabsContent>
      </Tabs>
    </div>
  )
}
