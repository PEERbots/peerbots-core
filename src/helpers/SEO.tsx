/**
 * Metadata props accepted by the {@link SEO} document head helper.
 */
interface SEOProps {
  /** Page title (formatted as `"${title} | Peerbots App"`, or `"Peerbots App"` when `"Home"`). */
  title: string;
  /** Meta description for search engines, Open Graph, and Twitter Cards. */
  description?: string;
  /** Social preview image URL or path (defaults to `"/peerbots-logo.png"`). */
  image?: string;
  /** Canonical page URL for `og:url` (falls back to `window.location.href` in browser environments). */
  url?: string;
  /** Open Graph content type (defaults to `"website"`). */
  type?: string;
}

/**
 * Renders React 19 native document metadata tags (`<title>`, `<meta name="description">`,
 * Open Graph `og:*`, and Twitter `summary_large_image` card tags) for Peerbots web pages.
 */
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
