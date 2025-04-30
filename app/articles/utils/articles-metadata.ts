export interface ArticleMetadata {
  id: string
  title: string
  preview: string
  imageUrl: string
  slug: string
  language?: string
  hasCustomPage?: boolean
  isMarkdownBased?: boolean
  hidden?: boolean
  date?: string // Добавляем поле для даты публикации
}

export const articlesMetadata: ArticleMetadata[] = [
  {
    id: "11",
    title: "Республиканская AI-Олимпиада для школьников - Победители и Решения Отборочного этапа",
    preview:
      "Первая Республиканская AI-олимпиада для школьников, организованная DSML Kazakhstan совместно с CPFed, собрала участников со всей страны, чтобы выявить и поддержать юные таланты в области искусственного интеллекта. Олимпиада проходит в три этапа: отборочный тур, Kaggle-style соревнование для финалистов и офлайн-финал. Участникам предстоит решать задачи по машинному обучению, компьютерному зрению и обработке естественного языка.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles/ai_olymp/ai_qualifications.jpg",
    slug: "ai-olympiad-qualification-results",
    language: "ru",
    isMarkdownBased: true,
    date: "30 апреля 2025",
  },
  {
    id: "1",
    title: "Программы бакалавриата в Казахстанских вузах для будущих специалистов по данным",
    preview: `Лето - время отпусков, каникул, и... горящих дедлайнов сбора документов для абитуриентов. Мы решили сделать подборку программ бакалавриата в Казахстанских вузах.`,
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//photo_2023-07-02_20-08-38.jpg",
    slug: "universities-for-data-science-2023",
    language: "ru",
    hasCustomPage: true,
    isMarkdownBased: true,
    date: "2 июля 2023",
  },
  {
    id: "2",
    title: "Исследование ДСМЛ: Лучшая компания для работы дата специалиста 2022",
    preview:
      "Настоящее исследование, организованное сообществом DSML Kazakhstan, направлено на выявление наиболее привлекательных компаний Казахстана для работы в сфере анализа данных. \nКлючевая задача заключалась в получении комплексного и репрезентативного представления о корпоративной среде — включая качество данных, внутренние процессы, командную культуру и условия труда — на основе мнений текущих и бывших сотрудников.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles/research/DSML_research_company.png",
    slug: "best-company-for-data-specialists-2022",
    language: "ru",
    isMarkdownBased: true,
    hidden: false,
    date: "1 июля 2022",
  },
  {
    id: "3",
    title: "DSML Исследование: лучший университет для работы в сфере анализа данных",
    preview:
      "Это исследование инициировано сообществом DSML Kazakhstan с целью объективно оценить технические ВУЗы страны глазами студентов и выпускников.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles/research/DSML_research_univer.png",
    slug: "best-technical-university-research-2022",
    language: "ru",
    isMarkdownBased: true,
    date: "1 августа 2022",
  },
  {
    id: "4",
    title: "Виртуальное собеседование в BTS Digital",
    preview:
      "Подробный разбор процесса собеседования в BTS Digital для специалистов по данным: этапы, типичные вопросы и советы по подготовке.",
    imageUrl: "/placeholder.svg?height=400&width=600",
    slug: "virtual-interview-bts-digital",
    language: "ru",
    isMarkdownBased: true,
    hidden: true,
    date: "10 марта 2023",
  },
  {
    id: "5",
    title: "Отзыв на учебу в ШАДе Султана Нурмухамедова",
    preview:
      "Султан Нурмухамедов делится своим опытом обучения в Школе анализа данных Яндекса (ШАД): программа, сложности и полученные навыки.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles/ysda_review/SHAD_sultan%20(2).png",
    slug: "shad-review-sultan-nurmukhamedov",
    language: "ru",
    isMarkdownBased: true,
    date: "8 мая 2023",
  },
  {
    id: "6",
    title: "DSML Interview: Александр Пак",
    preview:
      "В рамках рубрики DS/ML интервью, мы начинаем серию интервью c @AlexPak83. Александр Пак - кандидат технических наук, ассоциированный профессор ШИТиИ КБТУ.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//photo_2023-03-09_16-16-12.jpg",
    slug: "dsml-interview-alexander-pak",
    language: "ru",
    hasCustomPage: true,
    isMarkdownBased: true,
    date: "9 марта 2023",
  },
  {
    id: "7",
    title: "DSML Interview: Алибек Утюбаев",
    preview:
      "Мы обсудили с Алибеком его путь в сфере, видение развития анализа данных в Казахстане, рекомендации для начинающих и многое другое.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//photo_2022-12-01_09-58-58.jpg",
    slug: "alibek-interview",
    language: "ru",
    hasCustomPage: true,
    isMarkdownBased: false,
    date: "1 декабря 2022",
  },
  {
    id: "8",
    title: "ДСМЛ Доклад: Опыт поиска работы в сфере анализа данных в 2023 году",
    preview: "Докладчик Ануар Аймолдин делится опытом поиска работы в сфере анализа данных в 2023 году.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//photo_2023-02-04_18-07-03.jpg",
    slug: "dsml-report-job-search-experience-2023",
    language: "ru",
    isMarkdownBased: true,
    hidden: true,
    date: "4 февраля 2023",
  },
  {
    id: "9",
    title: "Отзыв на учебу в ШАДе Алена Баева",
    preview:
      "Ален Баев делится своим опытом обучения в Школе анализа данных Яндекса (ШАД): поступление, сложности и полученные навыки.",
    imageUrl:
      "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles/ysda_review/shad_alen%20(2).png",
    slug: "shad-review-alen-baev",
    language: "ru",
    isMarkdownBased: true,
    date: "12 мая 2020",
  },
  {
    id: "10",
    title: "Ануар Аймолдин - ODS ML Competitions Progress Award 2019",
    preview:
      "Байки с кэггла Ануара Аймолдина на ODS Дата Елке - итоговой конференции русскоязычного сообщества дата саентистов в Москве (2019)",
    imageUrl: "https://swfxusemimczhhhfzjhc.supabase.co/storage/v1/object/public/articles//anuar_with_logo.png",
    slug: "anuar-aimoldin-ods-ml-competitions-award-2019",
    language: "ru",
    isMarkdownBased: true,
    date: "20 декабря 2019",
  },
]

export function getArticleMetadata(slug: string): ArticleMetadata | undefined {
  return articlesMetadata.find((article) => article.slug === slug)
}
