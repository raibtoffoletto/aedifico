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
import { Heading, Text, Flex } from '@chakra-ui/react';
import {
  Layout,
  Header,
  getNamespacePaths,
  getSettings,
  getFilePath,
  getContents,
} from '../../lib';
import * as components from '../../components/MD';

export default function Post({
  body,
  date,
  tags,
  pageTitle,
  menu,
  footer,
  socialMedia,
  config,
}) {
  return (
    <>
      <Header {...config} page={pageTitle} />
      <Layout
        {...{ menu, footer, socialMedia, path: 'posts' }}
        title={config?.title ?? ''}
      >
        <Heading as="h1" size="xl" align="center" mb={2}>
          {pageTitle}
        </Heading>
        <Text align="center" mb={2}>
          {new Date(date).toLocaleString(config?.language, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Flex
          justifyContent={{ base: 'center', md: 'flex-end' }}
          gap={2}
          mb={2}
          color="gray.500"
        >
          {tags?.split(',')?.map?.((t) => (
            <span key={t}>{`#${t.trim()}`}</span>
          ))}
        </Flex>
        {!!body && !!components && (
          <MDXRemote {...body} components={components} />
        )}
      </Layout>
    </>
  );
}

export async function getStaticProps({ params: { slug } }) {
  try {
    const settings = await getSettings();
    if (!settings) {
      return {
        notFound: true,
      };
    }

    const file = await getFilePath('posts', slug);

    const { title: pageTitle, content, date, tags } = await getContents(file);

    const body = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [rehypeRaw],
        remarkPlugins: [remarkGfm],
      },
    });

    return {
      props: {
        ...settings,
        pageTitle,
        body,
        date,
        tags,
      },
    };
  } catch (err) {
    console.log(err); // eslint-disable-line

    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  try {
    const paths = await getNamespacePaths('posts');

    return {
      paths,
      fallback: false,
    };
  } catch (err) {
    console.log(err); // eslint-disable-line
  }
}
