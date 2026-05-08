"use client"

import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Globe,
  Heart,
  Lightbulb,
  MessageSquare,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"

type ValueCard = {
  icon: LucideIcon
  title: string
  description: string
  accent: string
  surface: string
}

export function RulesContent() {
  const { t } = useTranslation()

  const culturePillars = [
    {
      icon: Users,
      label: t("rules.tabs.welcome"),
      title: t("rules.welcome.title"),
      description: t("rules.welcome.intro"),
      href: "#welcome",
    },
    {
      icon: MessageSquare,
      label: t("rules.tabs.content"),
      title: t("rules.content.guidelines.title"),
      description: t("rules.content.guidelines.constructive"),
      href: "#content",
    },
    {
      icon: Shield,
      label: t("rules.tabs.moderation"),
      title: t("rules.moderation.process.title"),
      description: t("rules.moderation.process.description"),
      href: "#moderation",
    },
  ]

  const communityValues: ValueCard[] = [
    {
      icon: Heart,
      title: t("rules.values.respect.title"),
      description: t("rules.values.respect.description"),
      accent: "text-[#FFF32A]",
      surface: "border-[#FFF32A]/30 bg-[#FFF32A]/10",
    },
    {
      icon: BookOpen,
      title: t("rules.values.learning.title"),
      description: t("rules.values.learning.description"),
      accent: "text-[#00AEC7]",
      surface: "border-[#00AEC7]/30 bg-[#00AEC7]/10",
    },
    {
      icon: UserCheck,
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
      icon: Globe,
      title: t("rules.values.diversity.title"),
      description: t("rules.values.diversity.description"),
      accent: "text-cyan-200",
      surface: "border-cyan-200/30 bg-cyan-300/10",
    },
    {
      icon: Award,
      title: t("rules.values.excellence.title"),
      description: t("rules.values.excellence.description"),
      accent: "text-orange-200",
      surface: "border-orange-200/30 bg-orange-300/10",
    },
  ]

  const guidelines = [
    t("rules.content.guidelines.relevant"),
    t("rules.content.guidelines.respectful"),
    t("rules.content.guidelines.constructive"),
    t("rules.content.guidelines.original"),
  ]

  const boundaries = [
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

  return (
    <div className="min-h-screen overflow-hidden bg-[#050812] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#060b18]">
        <picture aria-hidden="true">
          <source media="(min-width: 768px)" srcSet="/images/moon-hero-desktop.png" />
          <img
            src="/images/moon-hero-mobile.png"
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
          />
        </picture>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(112deg,#050812_0%,rgba(5,8,18,0.96)_40%,rgba(0,174,199,0.34)_74%,rgba(255,243,42,0.5)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-[#050812] to-transparent" />

        <div className="container grid gap-10 px-4 py-14 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
          <div className="max-w-4xl">
            <Badge className="mb-5 max-w-full border border-[#00AEC7]/40 bg-[#00AEC7]/12 px-3 py-1 text-left leading-5 text-[#67e8f9] [overflow-wrap:anywhere] [white-space:normal]">
              <Sparkles className="mr-2 h-3.5 w-3.5 shrink-0" />
              {t("rules.values.title")}
            </Badge>
            <h1 className="max-w-4xl break-words text-balance font-sans text-[clamp(2.5rem,8.2vw,5.8rem)] font-black leading-[0.96] tracking-normal [overflow-wrap:break-word]">
              {t("rules.title")}
            </h1>
            <p className="mt-6 max-w-3xl text-balance text-base font-medium leading-7 text-slate-200 sm:text-lg">
              {t("rules.description")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-auto min-h-12 rounded-full bg-[#FFF32A] px-6 py-3 font-semibold text-black hover:bg-[#FFF32A]/90"
              >
                <Link href="/auth/signup">
                  {t("rules.cta.button")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-lg border border-white/14 bg-black/35 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFF32A]">{t("rules.welcome.mission.title")}</p>
              <Compass className="h-6 w-6 text-[#00AEC7]" />
            </div>
            <p className="pt-5 text-sm font-medium leading-7 text-slate-100">{t("rules.welcome.mission.description")}</p>
            <div className="mt-5 rounded-lg border border-[#00AEC7]/25 bg-[#00AEC7]/10 p-4">
              <p className="text-sm leading-6 text-slate-200">{t("rules.welcome.community.description")}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070c18]">
        <div className="container grid gap-3 px-4 py-5 md:grid-cols-3">
          {culturePillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <Link
                key={pillar.href}
                href={pillar.href}
                className="group flex min-h-28 items-start gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-[#00AEC7]/50 hover:bg-[#00AEC7]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AEC7]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#00AEC7]/25 bg-[#00AEC7]/10">
                  <Icon className="h-5 w-5 text-[#00AEC7]" />
                </span>
                <span>
                  <span className="font-pixel text-xs leading-none text-[#FFF32A]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block text-sm font-bold text-white">{pillar.label}</span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-400">{pillar.title}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section id="welcome" className="scroll-mt-24 px-4 py-14 sm:py-16" aria-labelledby="welcome-title">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="max-w-xl">
            <Badge className="mb-4 border border-[#FFF32A]/35 bg-[#FFF32A]/12 text-[#FFF32A]">
              {t("rules.tabs.welcome")}
            </Badge>
            <h2
              id="welcome-title"
              className="break-words text-balance text-3xl font-black leading-tight [overflow-wrap:anywhere] sm:text-5xl"
            >
              {t("rules.welcome.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{t("rules.welcome.intro")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-lg border border-[#00AEC7]/30 bg-[#00AEC7]/10 p-5">
              <Target className="mb-5 h-7 w-7 text-[#00AEC7]" />
              <h3 className="text-lg font-bold text-white">{t("rules.welcome.mission.title")}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t("rules.welcome.mission.description")}</p>
            </article>
            <article className="rounded-lg border border-[#FFF32A]/30 bg-[#FFF32A]/10 p-5">
              <Globe className="mb-5 h-7 w-7 text-[#FFF32A]" />
              <h3 className="text-lg font-bold text-white">{t("rules.welcome.community.title")}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{t("rules.welcome.community.description")}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a1020] px-4 py-14 sm:py-16" aria-labelledby="values-title">
        <div className="container">
          <div className="max-w-3xl">
            <Badge className="mb-4 border border-[#00AEC7]/35 bg-[#00AEC7]/12 text-[#67e8f9]">
              {t("rules.values.title")}
            </Badge>
            <h2
              id="values-title"
              className="break-words text-balance text-3xl font-black leading-tight [overflow-wrap:anywhere] sm:text-5xl"
            >
              {t("rules.values.title")}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communityValues.map((value) => {
              const Icon = value.icon
              return (
                <article key={value.title} className={cn("rounded-lg border p-5 transition-transform duration-200 hover:-translate-y-1", value.surface)}>
                  <Icon className={cn("mb-5 h-7 w-7", value.accent)} />
                  <h3 className="text-lg font-bold text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{value.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="content" className="scroll-mt-24 px-4 py-14 sm:py-16" aria-labelledby="content-title">
        <div className="container grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <Badge className="mb-4 border border-emerald-300/35 bg-emerald-300/12 text-emerald-200">
              {t("rules.tabs.content")}
            </Badge>
            <h2
              id="content-title"
              className="break-words text-balance text-3xl font-black leading-tight [overflow-wrap:anywhere] sm:text-5xl"
            >
              {t("rules.content.guidelines.title")}
            </h2>
            <div className="mt-8 grid gap-4">
              {guidelines.map((item) => (
                <article key={item} className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" />
                  <p className="text-base font-medium leading-7 text-slate-100">{item}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-red-400/20 bg-red-500/10 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-red-300" />
              <h2 className="text-2xl font-black text-white">{t("rules.content.prohibited.title")}</h2>
            </div>
            <div className="mt-6 grid gap-3">
              {boundaries.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-red-300/20 bg-black/20 p-4">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                  <p className="text-sm font-semibold leading-6 text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="moderation" className="scroll-mt-24 border-y border-white/10 bg-[#07111f] px-4 py-14 sm:py-16" aria-labelledby="moderation-title">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="max-w-xl">
            <Badge className="mb-4 border border-[#FFF32A]/35 bg-[#FFF32A]/12 text-[#FFF32A]">
              {t("rules.tabs.moderation")}
            </Badge>
            <h2
              id="moderation-title"
              className="break-words text-balance text-3xl font-black leading-tight [overflow-wrap:anywhere] sm:text-5xl"
            >
              {t("rules.moderation.process.title")}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">{t("rules.moderation.process.description")}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-6">
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
        </div>
      </section>

      <section className="bg-[linear-gradient(120deg,#07111f_0%,#0c1c25_48%,#26240a_100%)] px-4 py-14 sm:py-16">
        <div className="container">
          <div className="grid gap-8 rounded-lg border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <Badge className="mb-4 border border-white/20 bg-white/10 text-white">{t("rules.cta.title")}</Badge>
              <h2 className="break-words text-balance text-3xl font-black leading-tight [overflow-wrap:anywhere] sm:text-5xl">
                {t("rules.cta.title")}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-200">{t("rules.cta.description")}</p>
            </div>
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
          </div>
        </div>
      </section>
    </div>
  )
}
