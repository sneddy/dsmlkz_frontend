"use client"

import Head from "next/head"

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  url?: string
  image?: string
}

export function SEOHead({
  title = "DSMLKZ - Data Science & Machine Learning Kazakhstan Community",
  description = "DSMLKZ (DSML Kazakhstan) - крупнейшее сообщество специалистов по Data Science и Machine Learning в Казахстане. Присоединяйтесь к 10,000+ участников!",
  keywords = "DSMLKZ, DSML Kazakhstan, Data Science Kazakhstan, Machine Learning Kazakhstan, AI Kazakhstan, искусственный интеллект Казахстан, машинное обучение, анализ данных",
  url = "https://dsml.kz",
  image = "https://dsml.kz/images/dsml-logo.png"
}: SEOHeadProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DSMLKZ",
    "alternateName": ["DSML Kazakhstan", "Data Science Machine Learning Kazakhstan"],
    "url": url,
    "logo": image,
    "description": description,
    "foundingDate": "2018",
    "location": {
      "@type": "Country",
      "name": "Kazakhstan"
    },
    "sameAs": [
      "https://t.me/dsmlkz_news",
      "https://t.me/ml_jobs_kz",
      "https://www.youtube.com/c/DataScienceKazakhstan",
      "https://www.linkedin.com/company/53101063"
    ],
    "memberOf": {
      "@type": "Thing",
      "name": "Data Science Community"
    }
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="DSMLKZ Community" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="DSMLKZ" />
      <meta property="og:locale" content="ru_KZ" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags for DSMLKZ */}
      <meta name="geo.region" content="KZ" />
      <meta name="geo.country" content="Kazakhstan" />
      <meta name="language" content="ru,en,kk" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  )
}
