/**
 * Copyright 2019 ~ 2022 Raí B. Toffoletto (https://toffoletto.me)
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301 USA
 *
 * Authored by: Raí B. Toffoletto <rai@toffoletto.me>
 */

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

  if (typeof document !== 'undefined') {
    // Set up lang attribute to HTML tag from settings
    document?.documentElement?.setAttribute?.('lang', language);
  }

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
