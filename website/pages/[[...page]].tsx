import Header from '@components/Header';
import Layout from '@components/Layout';
import * as components from '@components/MDComponents';
import PageTitle from '@components/PageTitle';
import { CACHES } from '@constants';
import getCache from '@lib/getCache';
import { getPage } from '@lib/getContent';
import settings from '@settings';
import type { GetStaticPaths, GetStaticProps } from 'next';
import {
  MDXRemote,
  MDXRemoteProps,
  MDXRemoteSerializeResult,
} from 'next-mdx-remote';

const { initialPage } = settings;

interface PageProps {
  title: string;
  body: MDXRemoteSerializeResult;
}

export default function Page({ title, body }: PageProps) {
  return (
    <Layout>
      <Header page={title} />

      <PageTitle>{title}</PageTitle>

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
    const { page }: { page?: string[] } = params ?? {};

    const isLandingPage = !page || page[0] === '/';

    if (isLandingPage && !initialPage) {
      return {
        redirect: {
          statusCode: 302,
          destination: '/posts',
        },
      };
    }

    return {
      props: await getPage(isLandingPage ? [initialPage] : page),
    };
  } catch (error) {
    console.log(error); // eslint-disable-line

    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { paths } = await getCache<IPageCache>(CACHES.pages);

  return {
    paths: ['/', ...paths],
    fallback: false,
  };
};
