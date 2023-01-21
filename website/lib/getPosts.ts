import { CACHES, PostsRoute } from '@constants';
import getCache from './getCache';

function getTree(posts: IContentFile[]) {
  const tree: TPostTree = {};

  for (const post of posts) {
    const path = `${PostsRoute}${post.path}`;

    if (post.year in tree) {
      if (post.month in tree[post.year]) {
        tree[post.year][post.month] = {
          ...tree[post.year][post.month],
          [path]: post.title,
        };
      } else {
        tree[post.year][post.month] = { [path]: post.title };
      }
    } else {
      tree[post.year] = {
        [post.month]: { [path]: post.title },
      };
    }
  }

  return tree;
}

export default async function getPosts() {
  const { posts } = await getCache<IPostCache>(CACHES.posts);

  const list = posts.filter((p) => {
    const date = new Date(p.date).getTime();

    return !isNaN(date) && date <= Date.now();
  });

  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    list,
    tree: getTree(list),
  };
}
