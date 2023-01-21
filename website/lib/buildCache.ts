import { CACHES, MDFile } from '@constants';
import { opendir, writeFile } from 'fs/promises';
import { join } from 'path';
import getPrefixes from './getPrefixes';
import parseContents from './parseContents';

type WalkPath = AsyncGenerator<string, string | WalkPath, void>;

async function* walk(dir: string): WalkPath {
  for await (const entry of await opendir(dir)) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.isFile()) {
      yield path;
    }
  }

  return Promise.resolve('');
}

async function main() {
  const { PAGES, POSTS, CACHE } = await getPrefixes();
  const pages: IPageFile[] = [];
  const posts: IContentFile[] = [];

  for await (const file of walk(PAGES)) {
    if (MDFile.test(file)) {
      const path = file.replace(PAGES, '').replace(MDFile, '');

      pages.push({ path, file });
    }
  }

  for await (const fullpath of walk(POSTS)) {
    if (MDFile.test(fullpath)) {
      posts.push(await parseContents(fullpath, true, POSTS));
    }
  }

  const pageCache: IPageCache = {
    paths: pages.map((p) => p.path),
    pages,
  };

  await writeFile(
    join(CACHE, `${CACHES.pages}.json`),
    JSON.stringify(pageCache, null, 2),
    { encoding: 'utf8' }
  );

  const postCache: IPostCache = {
    paths: posts.map((p) => p.path),
    posts,
  };

  await writeFile(
    join(CACHE, `${CACHES.posts}.json`),
    JSON.stringify(postCache, null, 2),
    { encoding: 'utf8' }
  );
}

main();
