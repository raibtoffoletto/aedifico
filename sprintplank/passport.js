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

const { join } = require('path');
const { compare, genSalt, hash: hashPassword } = require('bcrypt');
const { access, readFile, writeFile } = require('fs/promises');
const credentials_file = join(__dirname, 'credentials.json');

function withError(callback) {
  return async (...args) => {
    try {
      return await callback(...args);
    } catch (err) {
      console.error(`\n${err.message}\n`);
    }
  };
}

async function exists() {
  try {
    await access(credentials_file);
  } catch {
    throw new Error('Credentials were not set. Use the CLI.');
  }
}

async function verify(password = '') {
  if (!password) {
    throw new Error('Password must NOT be empty');
  }

  await exists();

  const { hash } = JSON.parse(await readFile(credentials_file));

  return await compare(password, hash);
}

async function create(password = '') {
  if (!password) {
    throw new Error('Password must NOT be empty');
  }

  const salt = await genSalt(10);
  const hash = await hashPassword(password, salt);

  await writeFile(credentials_file, JSON.stringify({ salt, hash }, null, 2));

  if (!(await verify(password))) {
    throw new Error('Something went wrong while creating credentials');
  }
}

async function salt() {
  await exists();

  const { salt } = JSON.parse(await readFile(credentials_file));

  return salt;
}

const getSalt = withError(salt);
const createCredentials = withError(create);
const verifyCredentials = withError(verify);

// Use as standalone script to create credentials:
// node passport create $PASSWORD

if (process.argv.length === 4 && process.argv[2] === 'create') {
  console.log('Creating json file.');

  createCredentials(process.argv[3]).then(() => {
    process.exit(0);
  });
}

module.exports = { getSalt, verifyCredentials };
