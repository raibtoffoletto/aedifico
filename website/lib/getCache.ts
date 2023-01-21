import { CACHES } from '@constants';
import { readFile } from 'fs/promises';
import { join } from 'path';
import getPrefixes from './getPrefixes';

export default async function getCache<T>(
  cache: keyof typeof CACHES
): Promise<T> {
  const { CACHE } = await getPrefixes();

  const file = await readFile(join(CACHE, `${CACHES[cache]}.json`), {
    encoding: 'utf8',
  });

  return JSON.parse(file);
}
