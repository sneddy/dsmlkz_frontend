import { tServer } from "@/lib/server-translations"
import { HomeContentSSR } from "@/widgets/home_content_ssr"
import type { Metadata } from "next"

interface HomePageProps {
  params: { lang: string }
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { t } = await tServer(params.lang)

  return {
    title: t("home.title") || "DSML Kazakhstan - Сообщество AI и Machine Learning",
    description: t("home.subtitle") || "DSMLKZ Community - Сообщество энтузиастов AI и Машинного обучения в Казахстане",
    alternates: {
      canonical: `/${params.lang}`,
      languages: {
        en: "/en",
        ru: "/ru",
        kk: "/kk",
      },
    },
    openGraph: {
      title: t("home.title") || "DSML Kazakhstan",
      description:
        t("home.subtitle") || "DSMLKZ Community - Сообщество энтузиастов AI и Машинного обучения в Казахстане",
      type: "website",
      locale: params.lang,
      alternateLocale: ["en", "ru", "kk"].filter((lang) => lang !== params.lang),
    },
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const { translations } = await tServer(lang)

  return <HomeContentSSR translations={translations} lang={lang} />
}
