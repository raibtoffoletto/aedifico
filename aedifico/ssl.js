const { readFile } = require('fs/promises');
const { join } = require('path');

async function getCerts() {
  const key = await readFile(join(__dirname, './certs/openssl.key'));

  const cert = await readFile(join(__dirname, './certs/openssl.csr'));

  return { key, cert };
}

module.exports = getCerts;
