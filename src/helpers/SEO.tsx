interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title,
  description = "Peerbots platform: social robots for everyone, powered by experts.",
  image = "/peerbots-logo.png", // Default image if one exists, customizable
  url,
  type = "website",
}: SEOProps) {
  const siteTitle = "Peerbots App";
  const fullTitle = title === "Home" ? siteTitle : `${title} | ${siteTitle}`;
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
