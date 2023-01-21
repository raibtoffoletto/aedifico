import { MDFile } from '@constants';
import { readFile } from 'fs/promises';
import grayMatter from 'gray-matter';
import yaml from 'js-yaml';

export default async function parseContents(
  file: string,
  short = false,
  basePath?: string
): Promise<IContentFile> {
  const contents = await readFile(file, { encoding: 'utf-8' });

  const { data, content: fullContent } = grayMatter(
    contents,
    short
      ? undefined
      : {
          engines: {
            yaml: (s: string) =>
              yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
          },
        }
  );

  const path = file.replace(`${basePath}`, '').replace(MDFile, '');

  const year = new Date(data?.date).getFullYear();

  const month = new Date(data?.date).getMonth();

  let content: string = fullContent;

  if (short) {
    const snippet =
      fullContent
        ?.split?.('\n')
        ?.find?.((c) => !!`${c}`.trim())
        ?.substring?.(0, 140) ?? '';

    content = snippet?.length === 140 ? snippet.replace(/.$/, '…') : snippet;
  }

  return {
    ...data,
    date: new Date(data?.date),
    file,
    path,
    year,
    month,
    content,
  };
}
