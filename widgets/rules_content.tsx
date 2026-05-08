"use client"

import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Globe2,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

type CultureItem = {
  icon: LucideIcon
  title: string
  description: string
  accent: string
  surface: string
}

export function RulesContent() {
  const { t } = useTranslation()

  const cultureValues: CultureItem[] = [
    {
      icon: HeartHandshake,
      title: t("rules.values.respect.title"),
      description: t("rules.values.respect.description"),
      accent: "text-[#FFF32A]",
      surface: "border-[#FFF32A]/30 bg-[#FFF32A]/10",
    },
    {
      icon: BookOpenCheck,
      title: t("rules.values.learning.title"),
      description: t("rules.values.learning.description"),
      accent: "text-[#00AEC7]",
      surface: "border-[#00AEC7]/30 bg-[#00AEC7]/10",
    },
    {
      icon: Users,
      title: t("rules.values.collaboration.title"),
      description: t("rules.values.collaboration.description"),
      accent: "text-emerald-300",
      surface: "border-emerald-300/30 bg-emerald-400/10",
    },
    {
      icon: Lightbulb,
      title: t("rules.values.innovation.title"),
      description: t("rules.values.innovation.description"),
      accent: "text-purple-300",
      surface: "border-purple-300/30 bg-purple-400/10",
    },
    {
      icon: Globe2,
      title: t("rules.values.diversity.title"),
      description: t("rules.values.diversity.description"),
      accent: "text-cyan-200",
      surface: "border-cyan-200/30 bg-cyan-300/10",
    },
    {
      icon: Scale,
      title: t("rules.values.excellence.title"),
      description: t("rules.values.excellence.description"),
      accent: "text-orange-200",
      surface: "border-orange-200/30 bg-orange-300/10",
    },
  ]

  const behaviorItems = [
    t("rules.content.guidelines.relevant"),
    t("rules.content.guidelines.respectful"),
    t("rules.content.guidelines.constructive"),
    t("rules.content.guidelines.original"),
  ]

  const boundaryItems = [
    t("rules.content.prohibited.spam"),
    t("rules.content.prohibited.harassment"),
    t("rules.content.prohibited.offtopic"),
    t("rules.content.prohibited.inappropriate"),
  ]

  const moderationSteps = [
    t("rules.moderation.steps.warning"),
    t("rules.moderation.steps.temporary"),
    t("rules.moderation.steps.permanent"),
  ]

  const stats = [
    { icon: Users, value: "10k+", label: t("rules.stats.members") },
    { icon: CalendarDays, value: "8", label: t("rules.stats.events") },
    { icon: BriefcaseBusiness, value: "500+", label: t("rules.stats.careers") },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-[#050812] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#060b18]">
        <picture aria-hidden="true">
          <source media="(min-width: 768px)" srcSet="/images/moon-hero-desktop.png" />
          <img
            src="/images/moon-hero-mobile.png"
            alt=""
            className="absolute inset-x-0 bottom-0 -z-20 h-full w-full object-cover opacity-20"
          />
        </picture>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,#050812_0%,rgba(5,8,18,0.92)_42%,rgba(0,174,199,0.38)_73%,rgba(255,243,42,0.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#050812] to-transparent" />

        <div className="container grid gap-10 px-4 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="max-w-4xl">
            <Badge className="mb-5 min-h-8 border border-[#00AEC7]/40 bg-[#00AEC7]/12 px-3 py-1 text-[#67e8f9]">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {t("rules.hero.kicker")}
            </Badge>

            <h1 className="max-w-4xl break-words text-balance font-sans text-[clamp(2.35rem,8vw,5.6rem)] font-black leading-[0.96] tracking-normal [overflow-wrap:break-word]">
              {t("rules.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-base font-medium leading-7 text-slate-200 sm:text-lg">
              {t("rules.description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-auto min-h-12 rounded-full bg-[#FFF32A] px-6 py-3 font-semibold text-black hover:bg-[#FFF32A]/90"
              >
                <Link href="/auth/signup">
                  {t("rules.hero.primaryAction")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-auto min-h-12 rounded-full border-white/25 bg-white/5 px-6 py-3 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/events">{t("rules.hero.secondaryAction")}</Link>
              </Button>
            </div>
          </div>

          <aside
            aria-label={t("rules.hero.proofTitle")}
            className="rounded-lg border border-white/14 bg-black/35 p-5 shadow-2xl backdrop-blur-xl sm:p-6"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFF32A]">{t("rules.hero.proofTitle")}</p>
              <BrainCircuit className="h-6 w-6 text-[#00AEC7]" />
            </div>
            <div className="grid gap-3 py-5">
              {["context", "evidence", "care"].map((key, index) => (
                <div key={key} className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#00AEC7] text-sm font-black text-black">
                    {index + 1}
                  </span>
                  <p className="text-sm font-medium leading-6 text-slate-100">{t(`rules.hero.proofItems.${key}`)}</p>
                </div>
              ))}
            </div>
            <p className="border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">{t("rules.hero.promise")}</p>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070c18]">
        <div className="container grid gap-3 px-4 py-5 md:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex min-h-24 items-center gap-4 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#00AEC7]/25 bg-[#00AEC7]/10">
                  <Icon className="h-5 w-5 text-[#00AEC7]" />
                </div>
                <div>
                  <p className="font-pixel text-2xl leading-none text-[#FFF32A]">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-300">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16" aria-labelledby="culture-principles">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="max-w-xl">
              <Badge className="mb-4 border border-[#FFF32A]/35 bg-[#FFF32A]/12 text-[#FFF32A]">
                {t("rules.culture.badge")}
              </Badge>
              <h2 id="culture-principles" className="text-balance text-3xl font-black leading-tight sm:text-5xl">
                {t("rules.values.title")}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">{t("rules.culture.description")}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {cultureValues.map((value) => {
                const Icon = value.icon
                return (
                  <article
                    key={value.title}
                    className={cn(
                      "rounded-lg border p-5 transition-transform duration-200 hover:-translate-y-1",
                      value.surface,
                    )}
                  >
                    <Icon className={cn("mb-5 h-7 w-7", value.accent)} />
                    <h3 className="text-lg font-bold text-white">{value.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{value.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1020] px-4 py-14 sm:py-16" aria-labelledby="behavior-title">
        <div className="container">
          <div className="max-w-3xl">
            <Badge className="mb-4 border border-[#00AEC7]/35 bg-[#00AEC7]/12 text-[#67e8f9]">{t("rules.actions.badge")}</Badge>
            <h2 id="behavior-title" className="text-balance text-3xl font-black leading-tight sm:text-5xl">
              {t("rules.content.guidelines.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{t("rules.actions.description")}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {behaviorItems.map((item) => (
              <article key={item} className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" />
                <p className="text-base font-medium leading-7 text-slate-100">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:py-16" aria-labelledby="boundaries-title">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <Badge className="mb-4 border border-orange-300/35 bg-orange-300/12 text-orange-200">{t("rules.boundaries.badge")}</Badge>
            <h2 id="boundaries-title" className="text-balance text-3xl font-black leading-tight sm:text-5xl">
              {t("rules.content.prohibited.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{t("rules.boundaries.description")}</p>

            <div className="mt-8 grid gap-3">
              {boundaryItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-red-400/20 bg-red-500/10 p-4">
                  <XCircle className="h-5 w-5 shrink-0 text-red-300" />
                  <p className="text-sm font-semibold text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#00AEC7]/30 bg-[#00AEC7]/10">
                <ShieldCheck className="h-6 w-6 text-[#00AEC7]" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{t("rules.moderation.process.title")}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{t("rules.moderation.process.description")}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {moderationSteps.map((step, index) => (
                <div key={step} className="relative flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#FFF32A] text-sm font-black text-black">
                      {index + 1}
                    </span>
                    {index < moderationSteps.length - 1 && <span className="h-full min-h-8 w-px bg-white/15" />}
                  </div>
                  <p className="pb-6 text-sm font-medium leading-6 text-slate-100">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-2 rounded-lg border border-[#FFF32A]/25 bg-[#FFF32A]/10 p-4">
              <p className="text-sm font-medium leading-6 text-[#fff8a3]">{t("rules.moderation.principle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(120deg,#07111f_0%,#0c1c25_48%,#26240a_100%)] px-4 py-14 sm:py-16">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <Badge className="mb-4 border border-white/20 bg-white/10 text-white">
                <Rocket className="mr-2 h-3.5 w-3.5 text-[#FFF32A]" />
                {t("rules.cta.badge")}
              </Badge>
              <h2 className="text-balance text-3xl font-black leading-tight sm:text-5xl">{t("rules.cta.title")}</h2>
              <p className="mt-4 text-base leading-7 text-slate-200">{t("rules.cta.description")}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                asChild
                size="lg"
                className="h-auto min-h-12 rounded-full bg-[#00AEC7] px-6 py-3 font-semibold text-black hover:bg-[#00AEC7]/90"
              >
                <Link href="/auth/signup">
                  {t("rules.cta.button")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-auto min-h-12 rounded-full border-white/25 bg-white/5 px-6 py-3 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/news">
                  <MessageCircle className="h-4 w-4" />
                  {t("rules.cta.secondary")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
