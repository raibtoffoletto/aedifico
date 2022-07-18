import { join } from 'path';
import { readFile, opendir, access } from 'fs/promises';
import grayMatter from 'gray-matter';
import yaml from 'js-yaml';

export async function* walk(dir) {
  for await (const entry of await opendir(dir)) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walk(path);
    } else if (entry.isFile()) {
      yield path;
    }
  }
}

export const testExtention = /\.md(x)*$/i;

export const basePath = join(process.cwd(), '..', 'data', 'contents');

export async function getNamespacePaths(namespace = '', full = false) {
  const paths = [];

  const nsPath = join(basePath, namespace);

  for await (const path of walk(nsPath)) {
    if (testExtention.test(path)) {
      paths.push(
        full
          ? path
          : path
              .replace(namespace === 'posts' ? basePath : nsPath, '')
              .replace(testExtention, '')
      );
    }
  }

  return paths;
}

export async function getSettings() {
  const contents = await readFile(join(basePath, 'settings.json'), {
    encoding: 'utf-8',
  });

  return JSON.parse(contents);
}

export async function getFilePath(namespace = '', path = []) {
  const subPath = path.slice(0, path.length - 1);

  let filePath = '';

  for await (const search of walk(join(basePath, namespace, ...subPath))) {
    if (search.includes([namespace, ...path].join('/'))) {
      filePath = search;

      break;
    }
  }

  if (!filePath) {
    throw new Error();
  }

  await access(filePath);

  return filePath;
}

export async function getContents(file = '', short = false) {
  const contents = await readFile(file, { encoding: 'utf-8' });

  const { data, content } = grayMatter(
    contents,
    short
      ? undefined
      : {
          engines: {
            yaml: (s) => yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }),
          },
        }
  );

  const path = short
    ? file.replace(basePath, '').replace(testExtention, '')
    : undefined;

  const year = short ? new Date(data?.date).getFullYear() : undefined;

  const month = short ? new Date(data?.date).getMonth() + 1 : undefined;

  return {
    ...data,
    date: !!data?.date && short ? new Date(data?.date) : data?.date ?? null,
    path,
    year,
    month,
    content: short
      ? content
          ?.split?.('\n')
          ?.find?.((c) => !!`${c}`.trim())
          ?.substring(0, 140)
      : content,
  };
}
