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
