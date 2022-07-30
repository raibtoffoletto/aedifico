/**
 * Copyright 2019 ~ 2022 Raí B. Toffoletto (https://toffoletto.me)
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program; if not, write to the
 * Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA 02110-1301 USA
 *
 * Authored by: Raí B. Toffoletto <rai@toffoletto.me>
 */

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
