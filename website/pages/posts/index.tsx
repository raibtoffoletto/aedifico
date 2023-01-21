import { Flex } from '@chakra-ui/react';
import Header from '@components/Header';
import Layout from '@components/Layout';
import PageTitle from '@components/PageTitle';
import PostArchive from '@components/PostArchive';
import PostList from '@components/PostList';
import getPosts from '@lib/getPosts';
import settings from '@settings';

const { blog } = settings;

interface PostsPageProps {
  list: IContentFile[];
  tree: TPostTree;
}

export default function PostsPage({ list, tree }: PostsPageProps) {
  return (
    <Layout>
      <Header page={blog.title} />

      <Flex gap={4}>
        <Flex flexDirection="column" flexGrow={1}>
          <PageTitle>{blog.title}</PageTitle>

          <PostList list={list} />
        </Flex>

        <PostArchive tree={tree} />
      </Flex>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    return {
      props: await getPosts(),
    };
  } catch (error) {
    console.log(error); // eslint-disable-line
    return {
      notFound: true,
    };
  }
}
