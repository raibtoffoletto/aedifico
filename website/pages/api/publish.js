import { exec } from 'child_process';
import { promisify } from 'util';
import { rm, cp, readdir, readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

const credentials_file = join(process.cwd(), '../sprintplank/credentials.json');

export default async function getPublish(req, res) {
  try {
    const { method, headers } = req;

    if (method !== 'GET') {
      throw new Error('Method not allowed');
    }

    const auth = headers?.['authorization'] ?? null;
    const { hash } = JSON.parse((await readFile(credentials_file)).toString());

    if (!auth || !hash || auth !== hash) {
      throw new Error('Unauthorized access');
    }

    const { stdout: buildLog } = await execAsync('yarn export', {
      shell: true,
    });

    const outDir = join(process.cwd(), 'out');
    const buildDir = join(process.cwd(), '../aedifico/build');

    const clearBuild = [];
    const oldBuild = await readdir(buildDir);
    oldBuild.forEach((path) =>
      clearBuild.push(
        rm(join(buildDir, path), { recursive: true, force: true })
      )
    );

    await Promise.all(clearBuild);

    const copyContents = [];
    const contents = await readdir(outDir);
    contents.forEach((path) =>
      copyContents.push(
        cp(join(outDir, path), join(buildDir, path), {
          force: true,
          recursive: true,
        })
      )
    );

    await Promise.all(copyContents);

    res.status(200).json({
      status: 'OK',
      buildLog,
    });

    exec(`touch ${join(process.cwd(), 'publish.timestamp')}`);
  } catch ({ message }) {
    res.status(400).json({ status: 'ERROR', message });
  }
}
