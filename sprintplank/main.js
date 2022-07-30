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

const https = require('https');
const express = require('express');
const morgan = require('morgan');
const { join } = require('path');
const { createReadStream } = require('fs');
const session = require('express-session');
const helmet = require('helmet');
const handler = require('serve-handler');
// const { RateLimiterRedis } = require('rate-limiter-flexible');
// const redis = require('redis');
const getCerts = require('../aedifico/ssl');
const { getSalt, verifyCredentials } = require('./passport');
const api = require('./api');

function sendFile(file, res) {
  res.type(file.split('.')[1]);

  const stream = createReadStream(join(__dirname, 'src', file));

  stream.on('open', () => {
    stream.pipe(res);
  });
}

async function main() {
  try {
    // const storeClient = redis.createClient({
    //   enable_offline_queue: false,
    // });

    // await storeClient.connect();

    // const rateLimiter = new RateLimiterRedis({
    //   storeClient,
    //   keyPrefix: 'middleware',
    //   points: 10,
    //   duration: 1,
    // });

    const secret = await getSalt();

    const app = express();

    app.set('trust proxy', 1);

    app.use(helmet());

    app.use(morgan('dev'));

    app.use(express.json());

    app.use(express.urlencoded({ extended: false }));

    app.use(
      session({
        secret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
      })
    );

    // app.use((req, res, next) => {
    //   rateLimiter
    //     .consume(req.ip)
    //     .then(() => {
    //       next();
    //     })
    //     .catch(() => {
    //       res.status(429).send('Too Many Requests');
    //     });
    // });

    app.use('/favicon.ico', (req, res) => {
      sendFile('favicon.ico', res);
    });

    app.use('/logo192.png', (req, res) => {
      sendFile('logo192.png', res);
    });

    app.use('/manifest.json', (req, res) => {
      sendFile('manifest.json', res);
    });

    app.use('/signOut', (req, res) => {
      req.session.lock = 'lock';

      res.writeHead(301, { Location: '/' });
      res.end();
    });

    app.use('/', async (req, res, next) => {
      if (req.method === 'POST') {
        if (await verifyCredentials(req.body.password)) {
          req.session.lock = 'open';

          res.writeHead(301, { Location: req.originalUrl });
          res.end();
          return;
        } else {
          req.session.lock = 'lock';
        }
      }

      if (req.session.lock === 'open') {
        next();
      } else {
        sendFile('login.html', res);
      }
    });

    app.use('/api', api);

    app.use('/', (req, res) => {
      if (process.env.NODE_ENV === 'development') {
        res
          .status(200)
          .send('Development Session: Use sprintplank app at port 3000')
          .end();

        return;
      }

      return handler(req, res, {
        public: join(__dirname, 'src'),
      });
    });

    const { key, cert } = await getCerts();

    // [!] Accept only https requests
    https.createServer({ key, cert }, app).listen(4000, () => {
      console.log('Running at https://localhost:4000');
    });
  } catch (error) {
    console.log(error);
  }
}

main();
