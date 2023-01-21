import { Flex, Text } from '@chakra-ui/react';
import Header from '@components/Header';
import Layout from '@components/Layout';
import * as components from '@components/MDComponents';
import PageTitle from '@components/PageTitle';
import { CACHES, PostsRoute } from '@constants';
import getCache from '@lib/getCache';
import { getPost } from '@lib/getContent';
import type { GetStaticPaths, GetStaticProps } from 'next';
import {
  MDXRemote,
  MDXRemoteProps,
  MDXRemoteSerializeResult,
} from 'next-mdx-remote';

interface PageProps {
  title: string;
  date: string;
  tags: string[];
  body: MDXRemoteSerializeResult;
}

export default function Post({ title, date, tags, body }: PageProps) {
  return (
    <Layout>
      <Header page={title} />

      <PageTitle>{title}</PageTitle>

      <Text align="center" mb={2}>
        {date}
      </Text>

      <Flex
        justifyContent={{ base: 'center', md: 'flex-end' }}
        gap={2}
        mb={2}
        color="gray.500"
      >
        {tags.map((t) => (
          <span key={t}>{`#${t.trim()}`}</span>
        ))}
      </Flex>

      {!!body && !!components && (
        <MDXRemote
          {...body}
          components={components as MDXRemoteProps['components']}
        />
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { slug }: { slug?: string[] } = params ?? {};

    return !!slug
      ? {
          props: await getPost(slug),
        }
      : {
          redirect: {
            statusCode: 302,
            destination: '/posts',
          },
        };
  } catch (err) {
    console.log(err); // eslint-disable-line

    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { paths } = await getCache<IPostCache>(CACHES.posts);

  return {
    paths: paths.map((p) => `${PostsRoute}${p}`),
    fallback: false,
  };
};
