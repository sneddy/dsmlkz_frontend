import { HomeContent } from "@/widgets/home_content"
import { absoluteUrl } from "@/lib/seo"

export async function generateMetadata() {
  return {
    title: "DSML Kazakhstan — Data Science & ML Community",
    description:
      "Join Kazakhstan's leading AI and Machine Learning community. Connect with 10,000+ professionals, access exclusive resources, and accelerate your career in data science.",
    openGraph: {
      title: "DSML Kazakhstan — Data Science & ML Community",
      description:
        "Join Kazakhstan's leading AI and Machine Learning community. Connect with 10,000+ professionals, access exclusive resources, and accelerate your career in data science.",
      type: "website",
      url: absoluteUrl("/"),
      images: [{ url: absoluteUrl("/images/dsml-logo.png") }],
    },
    twitter: {
      card: "summary_large_image",
      title: "DSML Kazakhstan — Data Science & ML Community",
      description:
        "Join Kazakhstan's leading AI and Machine Learning community. Connect with 10,000+ professionals, access exclusive resources, and accelerate your career in data science.",
      images: [absoluteUrl("/images/dsml-logo.png")],
    },
    alternates: {
      canonical: absoluteUrl("/"),
    },
  }
}

export default function Home() {
  return <HomeContent />
}
