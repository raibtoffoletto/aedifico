////////////////////////////////////////////////////////////////////////
//                                                                    //
// Copyright (c) 2019 Raí B. Toffoletto (https://toffoletto.me)       //
//                                                                    //
// This program is free software; you can redistribute it and/or      //
// modify it under the terms of the GNU General Public                //
// License as published by the Free Software Foundation; either       //
// version 2 of the License, or (at your option) any later version.   //
//                                                                    //
// This program is distributed in the hope that it will be useful,    //
// but WITHOUT ANY WARRANTY; without even the implied warranty of     //
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU  //
// General Public License for more details.                           //
//                                                                    //
// You should have received a copy of the GNU General Public          //
// License along with this program; if not, write to the              //
// Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,   //
// Boston, MA 02110-1301 USA                                          //
//                                                                    //
// Authored by: Raí B. Toffoletto <rai@toffoletto.me>                 //
//                                                                    //
////////////////////////////////////////////////////////////////////////

const { join } = require('path');
const https = require('https');
const morgan = require('morgan');
const handler = require('serve-handler');
const getCerts = require('./ssl');

async function main() {
  try {
    const { key, cert } = await getCerts();

    https
      .createServer({ key, cert }, (req, res) => {
        morgan('common')(req, res, (error) => {
          if (error instanceof Error) {
            console.log(`[ERROR]: ${error.message}`);
          }
        });

        return handler(req, res, {
          public: join(__dirname, 'build'),
        });
      })
      .listen(3000, () => {
        console.log('Running at https://localhost:3000');
      });
  } catch (error) {
    console.log(error);
  }
}

main();
