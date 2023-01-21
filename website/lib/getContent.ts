import { CACHES } from '@constants';
import settings from '@settings';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import getCache from './getCache';
import parseContents from './parseContents';

const { config } = settings;

function getBody(content: string) {
  return serialize(content, {
    mdxOptions: {
      rehypePlugins: [rehypeRaw],
      remarkPlugins: [remarkGfm],
    },
  });
}

export async function getPage(page: string[]) {
  const { pages } = await getCache<IPageCache>(CACHES.pages);

  const { file } = pages.find((p) => p.path === `/${page.join('/')}`) ?? {};

  if (!file) {
    throw new Error();
  }

  const { title, content } = await parseContents(file);

  const body = await getBody(content);

  return { title, body };
}

export async function getPost(post: string[]) {
  const { posts } = await getCache<IPostCache>(CACHES.posts);

  const { file } = posts.find((p) => p.path === `/${post.join('/')}`) ?? {};

  if (!file) {
    throw new Error();
  }

  const {
    title,
    date: _date,
    tags: _tags,
    content,
  } = await parseContents(file);

  const date = _date.toLocaleString(config?.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tags = _tags?.split(',');

  const body = await getBody(content);

  return { title, date, tags, body };
}
