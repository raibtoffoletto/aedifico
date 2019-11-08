/*
* Aedifico framework
* Copyright (C) 2019 - Raí Biason Toffoletto <rai@toffoletto.me>
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const create_error = require ('http-errors');
const express = require ('express');
const logger = require ('morgan');
const path = require ('path');
const session = require ('express-session');
const passport = require ('./sprintplankPassport');
const helmet = require ('helmet');
const expressBrute = require ('express-brute');
const redisStore = require ('express-brute-redis');

var ipStore = new redisStore ({host: '127.0.0.1', port: 6379});
var bruteForce = new expressBrute (ipStore);

var app = express ();
    app.set ('views', path.join (__dirname, 'views'));
    app.set ('view engine', 'ejs');
    app.use (helmet ());
    app.use (logger ('dev'));
    app.use (express.json ());
    app.use (express.urlencoded ({ extended: false }));
    app.use (session ({
      secret: passport.getSalt (),
      resave: false,
      saveUninitialized: false
    }));

    app.use ('/login', bruteForce.prevent, function (req, res, next) {
      if (passport.verifyCredentials (req.body.password)) {
        req.session.lock = 'open';
        res.writeHead (301, {'Location': req.headers['referer']});
        res.end ();
      } else {
        req.session.lock = 'lock';
        next ();
      }
    });

    app.use (function (req, res, next) {
      if (req.session.lock === 'open') {
          next ();
      } else {
          res.render ('login');
      }
    });

    app.use ('/', require ('./sprintplankRouter'));

    app.use (function (req, res, next) {
      next (create_error (404));
    });

    app.use (function (err, req, res, next) {
      res.locals.message = err.message;
      res.locals.error = req.app.get ('env') === 'development' ? err : {};
      res.status (err.status || 500);
      res.send ('<center><h1> Error ' + err.status + '</h1><p>' + err.message + '</p></center>');
      console.log (err.message);
    });

module.exports = app;