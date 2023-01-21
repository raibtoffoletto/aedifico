import settings from '@settings';
import { Head, Html, Main, NextScript } from 'next/document';

const { config } = settings;

export default function Document() {
  return (
    <Html lang={config.language}>
      <Head />

      <body>
        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
