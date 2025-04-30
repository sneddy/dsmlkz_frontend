"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { BlobImage } from "@/components/ui/blob-image"
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image?: string
  link?: string
  type: "meetup" | "workshop" | "conference" | "hackathon"
}

export function EventsContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockEvents: Event[] = [
          {
            id: "1",
            title: "DSML Meetup: Introduction to Large Language Models",
            description:
              "Join us for an evening of learning and networking as we explore the fundamentals of Large Language Models and their applications.",
            date: "2023-04-15",
            time: "18:00 - 20:00",
            location: "Almaty, Technopark",
            image: "/placeholder.svg?height=200&width=400",
            link: "https://t.me/dsml_events/123",
            type: "meetup",
          },
          {
            id: "2",
            title: "Workshop: Practical Computer Vision with TensorFlow",
            description:
              "A hands-on workshop where you'll learn how to build and deploy computer vision models using TensorFlow.",
            date: "2023-04-22",
            time: "10:00 - 16:00",
            location: "Astana, Nazarbayev University",
            image: "/placeholder.svg?height=200&width=400",
            link: "https://t.me/dsml_events/456",
            type: "workshop",
          },
          {
            id: "3",
            title: "Data Science Conference Kazakhstan 2023",
            description:
              "The largest data science conference in Kazakhstan featuring speakers from leading tech companies and research institutions.",
            date: "2023-05-10",
            time: "09:00 - 18:00",
            location: "Almaty, Rixos Hotel",
            image: "/placeholder.svg?height=200&width=400",
            link: "https://t.me/dsml_events/789",
            type: "conference",
          },
          {
            id: "4",
            title: "AI Hackathon: Solving Local Problems",
            description: "A 48-hour hackathon focused on developing AI solutions for local challenges in Kazakhstan.",
            date: "2023-06-03",
            time: "10:00 (48 hours)",
            location: "Online",
            link: "https://t.me/dsml_events/101",
            type: "hackathon",
          },
          {
            id: "5",
            title: "DSML Meetup: NLP for Kazakh Language",
            description:
              "A special meetup dedicated to natural language processing techniques for the Kazakh language.",
            date: "2023-06-20",
            time: "18:30 - 20:30",
            location: "Almaty, SmartPoint Hub",
            image: "/placeholder.svg?height=200&width=400",
            link: "https://t.me/dsml_events/112",
            type: "meetup",
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setEvents(mockEvents)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching events:", err)
        setError("Failed to load events. Please try again later.")
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const filterEventsByType = (type: string) => {
    if (type === "all") return events
    return events.filter((event) => event.type === type)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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
        <h1 className="text-3xl font-bold mb-2">{t("events.title")}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-6">{t("events.description")}</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="all">{t("events.all")}</TabsTrigger>
          <TabsTrigger value="meetup">{t("events.meetups")}</TabsTrigger>
          <TabsTrigger value="workshop">{t("events.workshops")}</TabsTrigger>
          <TabsTrigger value="conference">{t("events.conferences")}</TabsTrigger>
          <TabsTrigger value="hackathon">{t("events.hackathons")}</TabsTrigger>
        </TabsList>

        {["all", "meetup", "workshop", "conference", "hackathon"].map((type) => (
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
                      <div className="flex flex-col md:flex-row gap-6">
                        <Skeleton className="h-48 w-full md:w-1/3" />
                        <div className="space-y-4 w-full md:w-2/3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="flex gap-4 mt-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filterEventsByType(type).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("events.noEvents")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filterEventsByType(type).map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        <span className="capitalize">{event.type}</span> • {formatDate(event.date)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6">
                        {event.image && (
                          <div className="w-full md:w-1/3">
                            <BlobImage
                              src={event.image}
                              alt={event.title}
                              width={400}
                              height={200}
                              className="rounded-md w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        <div className={`space-y-4 w-full ${event.image ? "md:w-2/3" : ""}`}>
                          <p>{event.description}</p>
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                      {event.link && (
                        <Link href={event.link} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="flex items-center gap-2">
                            {t("events.learnMore")}
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button>{t("events.register")}</Button>
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
