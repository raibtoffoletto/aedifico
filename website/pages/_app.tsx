import ThemeProvider from '@components/ThemeProvider';
import '@components/styles.css';
import '@fontsource/ibm-plex-mono/100-italic.css';
import '@fontsource/ibm-plex-mono/100.css';
import '@fontsource/ibm-plex-mono/200-italic.css';
import '@fontsource/ibm-plex-mono/200.css';
import '@fontsource/ibm-plex-mono/300-italic.css';
import '@fontsource/ibm-plex-mono/300.css';
import '@fontsource/ibm-plex-mono/400-italic.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500-italic.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600-italic.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/ibm-plex-mono/700-italic.css';
import '@fontsource/ibm-plex-mono/700.css';
import '@fontsource/nunito/200.css';
import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@fontsource/nunito/900.css';
import '@fontsource/opendyslexic/400-italic.css';
import '@fontsource/opendyslexic/400.css';
import '@fontsource/opendyslexic/700-italic.css';
import '@fontsource/opendyslexic/700.css';
import '@fontsource/ubuntu/300-italic.css';
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/400-italic.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500-italic.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/700-italic.css';
import '@fontsource/ubuntu/700.css';
import settings from '@settings';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const { config } = settings;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{config.title}</title>
        <link rel="icon" href={config.favIcon} />
        <link rel="apple-touch-icon" href={config.appleIcon} />
        <link rel="canonical" href={config.url} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={config.author} />
        <meta name="site_name" content={config.title} />
        <meta name="description" content={config.description} />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content={config.title} />
        <meta property="og:locale" content={config.language} />
        <meta property="og:description" content={config.description} />
        <meta property="og:image" content={config.cardImage} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:url" content={config.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={config.url} />
        <meta name="twitter:title" content={config.title} />
        <meta name="twitter:creator" content={config.author} />
        <meta name="twitter:description" content={config.description} />
        <meta name="twitter:image" content={config.cardImage} />
      </Head>

      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
