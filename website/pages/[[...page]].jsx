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
