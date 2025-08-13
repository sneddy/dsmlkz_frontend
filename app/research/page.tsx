import type { Metadata } from "next"
import ResearchContent from "@/widgets/research_content"

export const metadata: Metadata = {
  title: "Research Hub - DSML Kazakhstan",
  description:
    "Discover AI and ML researchers from Central Asia, watch research seminars, and join our research community.",
  keywords: "research, AI, machine learning, Central Asia, Kazakhstan, researchers, seminars, publications",
}

export default function ResearchPage() {
  return <ResearchContent />
}
