import Head from 'next/head';

export default function Header({
  favIcon,
  appleIcon,
  cardImage,
  title,
  author,
  url,
  description,
  language,
  page,
}) {
  const _title = `${title}${!!page ? ` - ${page}` : ''}`;

  return (
    <Head>
      <meta charSet="utf-8" />
      <title>{_title}</title>
      <link rel="icon" href={favIcon} />
      <link rel="apple-touch-icon" href={appleIcon} />
      <link rel="canonical" href={url} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content={author} />
      <meta name="site_name" content={_title} />
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <meta property="og:title" content={page} />
      <meta property="og:locale" content={language} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={cardImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={url} />
      <meta name="twitter:title" content={_title} />
      <meta name="twitter:creator" content={author} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={cardImage} />
    </Head>
  );
}
