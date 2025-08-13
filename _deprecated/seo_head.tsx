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
  description = "DSMLKZ - крупнейшее сообщество специалистов по Data Science и Machine Learning в Казахстане. Более 10,000 участников, вакансии, обучение, нетворкинг.",
  keywords = "DSMLKZ, Data Science Kazakhstan, Machine Learning Kazakhstan, AI Kazakhstan, ML jobs, датасайенс казахстан",
  url = "https://dsml.kz",
  image = "https://dsml.kz/images/dsml-logo.png",
}: SEOHeadProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DSMLKZ",
    alternateName: ["Data Science Machine Learning Kazakhstan", "DSML Kazakhstan", "DSML KZ"],
    url: url,
    logo: image,
    description: description,
    foundingDate: "2018",
    location: {
      "@type": "Country",
      name: "Kazakhstan",
    },
    sameAs: [
      "https://t.me/dsmlkz_news",
      "https://www.youtube.com/c/DataScienceKazakhstan",
      "https://www.linkedin.com/company/53101063/",
    ],
    memberOf: {
      "@type": "Organization",
      name: "Global Data Science Community",
    },
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="DSMLKZ Team" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="DSMLKZ" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </Head>
  )
}
