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
