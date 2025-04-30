"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Search, ExternalLink, Clock } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

type Job = {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary?: string
  posted_date: string
  link?: string
  tags: string[]
  type: "data" | "it"
}

export function JobsContent() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockJobs: Job[] = [
          {
            id: "1",
            title: "Senior Data Scientist",
            company: "Kaspi Bank",
            location: "Almaty",
            description:
              "We are looking for a Senior Data Scientist to join our team and help us build advanced machine learning models for financial services.",
            salary: "$3,000 - $4,500",
            posted_date: "2023-03-15",
            link: "https://t.me/dsml_jobs/123",
            tags: ["Python", "Machine Learning", "SQL", "Finance"],
            type: "data",
          },
          {
            id: "2",
            title: "Machine Learning Engineer",
            company: "Kolesa Group",
            location: "Almaty",
            description:
              "Join our team to develop and deploy machine learning models that power our recommendation systems and search functionality.",
            salary: "$2,500 - $3,500",
            posted_date: "2023-03-10",
            link: "https://t.me/dsml_jobs/456",
            tags: ["Python", "TensorFlow", "AWS", "MLOps"],
            type: "data",
          },
          {
            id: "3",
            title: "Data Analyst",
            company: "Air Astana",
            location: "Astana",
            description:
              "We're seeking a Data Analyst to help us extract insights from our operational data and improve business processes.",
            posted_date: "2023-03-05",
            link: "https://t.me/dsml_jobs/789",
            tags: ["SQL", "Excel", "Tableau", "Aviation"],
            type: "data",
          },
          {
            id: "4",
            title: "Full Stack Developer",
            company: "Chocofamily",
            location: "Almaty",
            description: "Join our engineering team to build and maintain our e-commerce platforms and services.",
            salary: "$2,000 - $3,000",
            posted_date: "2023-03-12",
            link: "https://t.me/it_jobs_kz/123",
            tags: ["JavaScript", "React", "Node.js", "MongoDB"],
            type: "it",
          },
          {
            id: "5",
            title: "DevOps Engineer",
            company: "BTS Digital",
            location: "Astana",
            description:
              "We are looking for a DevOps Engineer to help us automate our infrastructure and deployment processes.",
            salary: "$2,500 - $3,500",
            posted_date: "2023-03-08",
            link: "https://t.me/it_jobs_kz/456",
            tags: ["Docker", "Kubernetes", "AWS", "CI/CD"],
            type: "it",
          },
          {
            id: "6",
            title: "AI Research Scientist",
            company: "Nazarbayev University",
            location: "Astana",
            description:
              "Join our research team to work on cutting-edge AI projects and publish papers in top-tier conferences.",
            posted_date: "2023-03-01",
            link: "https://t.me/dsml_jobs/101",
            tags: ["Deep Learning", "Research", "PyTorch", "NLP"],
            type: "data",
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setJobs(mockJobs)
        setFilteredJobs(mockJobs)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again later.")
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredJobs(jobs)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.tags.some((tag) => tag.toLowerCase().includes(query)),
    )

    setFilteredJobs(filtered)
  }, [searchQuery, jobs])

  const filterJobsByType = (type: string) => {
    if (type === "all") return filteredJobs
    return filteredJobs.filter((job) => job.type === type)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "1 day ago"
    } else if (diffDays < 30) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("jobs.title")}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">{t("jobs.description")}</p>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("jobs.searchPlaceholder")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="all">{t("jobs.all")}</TabsTrigger>
          <TabsTrigger value="data">{t("jobs.dataJobs")}</TabsTrigger>
          <TabsTrigger value="it">{t("jobs.itJobs")}</TabsTrigger>
        </TabsList>

        {["all", "data", "it"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                      <div className="flex gap-2 mt-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filterJobsByType(type).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("jobs.noJobs")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filterJobsByType(type).map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span>{job.title}</span>
                        {job.salary && <span className="text-base font-normal text-primary">{job.salary}</span>}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{job.location}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>{formatDate(job.posted_date)}</span>
                      </div>
                      {job.link && (
                        <Link href={job.link} target="_blank" rel="noopener noreferrer">
                          <Button className="flex items-center gap-2">
                            {t("jobs.apply")}
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
