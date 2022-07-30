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

import { Flex, Heading } from '@chakra-ui/react';
import {
  Layout,
  Header,
  PostArchive,
  PostList,
  getNamespacePaths,
  getSettings,
  getContents,
} from '../../lib';

function getTree(posts) {
  const tree = {};

  posts.forEach((post) => {
    if (post.year in tree) {
      if (post.month in tree[post.year]) {
        tree[post.year][post.month] = {
          ...tree[post.year][post.month],
          [post.path]: post.title,
        };
      } else {
        tree[post.year][post.month] = { [post.path]: post.title };
      }
    } else {
      tree[post.year] = {
        [post.month]: { [post.path]: post.title },
      };
    }
  });

  return tree;
}

export default function PostsPage({
  posts,
  postTree,
  menu,
  footer,
  socialMedia,
  config,
}) {
  return (
    <>
      <Header {...config} page={config?.blogTitle} />
      <Layout
        {...{ menu, footer, socialMedia, path: 'posts' }}
        title={config?.title ?? ''}
      >
        <Flex gap={4}>
          <Flex flexDirection="column" flexGrow={1}>
            <Heading as="h1" size="lg" align="center" mb={4}>
              {config?.blogTitle}
            </Heading>
            <PostList posts={posts} lng={config?.language} />
          </Flex>

          <Flex
            display={{ base: 'none', lg: 'flex' }}
            flexDirection="column"
            flexShrink={0}
            width={210}
          >
            <PostArchive
              postTree={postTree}
              lng={config?.language}
              title={config?.blogArchive}
            />
          </Flex>
        </Flex>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  try {
    const settings = await getSettings();

    if (!settings) {
      return {
        notFound: true,
      };
    }

    const _posts = await getNamespacePaths('posts', true);

    const postContents = _posts?.map?.((file) => getContents(file, true));

    const posts = await Promise.all(postContents);

    posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));

    const postTree = getTree(posts);

    return {
      props: {
        ...settings,
        posts: posts.map((p) => ({ ...p, date: p.date.toISOString() })),
        postTree,
      },
    };
  } catch (error) {
    console.log(error); // eslint-disable-line
    return {
      notFound: true,
    };
  }
}
