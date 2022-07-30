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

import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Heading } from '@chakra-ui/react';
import {
  Layout,
  Header,
  getNamespacePaths,
  getSettings,
  getFilePath,
  getContents,
} from '../lib';
import * as components from '../components/MD';

export default function PageRoute({
  body,
  noLayout,
  pageTitle,
  menu,
  footer,
  socialMedia,
  config,
  path,
}) {
  const content = (
    <>
      <Heading as="h1" size="lg" align="center" mb={4}>
        {pageTitle}
      </Heading>
      {!!body && !!components && (
        <MDXRemote {...body} components={components} />
      )}
    </>
  );

  return (
    <>
      <Header {...config} page={pageTitle} />
      {!!noLayout ? (
        content
      ) : (
        <Layout
          {...{ menu, footer, socialMedia, path }}
          title={config?.title ?? ''}
        >
          {content}
        </Layout>
      )}
    </>
  );
}

export async function getStaticProps({ params: { page } }) {
  try {
    const isLandingPage = !page || page?.[0] === '/';

    const settings = await getSettings();

    if (!settings) {
      return {
        notFound: true,
      };
    }

    const path = isLandingPage
      ? settings.initialPage.split('/')?.[0]
      : page?.[0];

    if (isLandingPage && !settings?.initialPage) {
      return {
        redirect: {
          destination: '/posts',
        },
      };
    }

    const file = await getFilePath(
      'pages',
      isLandingPage ? settings.initialPage.split('/') : page
    );

    const { title: pageTitle, layout, content } = await getContents(file);

    const body = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [rehypeRaw],
        remarkPlugins: [remarkGfm],
      },
    });

    return {
      props: { ...settings, path, pageTitle, body, noLayout: layout === false },
    };
  } catch (error) {
    console.log(error); // eslint-disable-line

    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const paths = await getNamespacePaths('pages');

    return {
      paths: ['/', ...paths],
      fallback: false,
    };
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
}
