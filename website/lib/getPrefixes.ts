import { access, mkdir } from 'fs/promises';
import { join } from 'path';

async function checkPath(path: string) {
  try {
    await access(path);
  } catch {
    await mkdir(path);
  }
}

export default async function getPrefixes() {
  const CWD = process.cwd();

  const PAGES = join(CWD, 'contents', 'pages');

  const POSTS = join(CWD, 'contents', 'posts');

  const CACHE = join(CWD, '.cache');

  await Promise.all([PAGES, POSTS, CACHE].map(checkPath));

  return { PAGES, POSTS, CACHE };
}
