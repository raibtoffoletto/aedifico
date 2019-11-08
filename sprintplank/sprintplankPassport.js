#!/usr/bin/env node
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

const fs = require ('fs');
const path = require ('path');
const bcrypt = require('bcrypt');
const credentials_file = path.join (__dirname, './credentials.json');

const createCredentials = function (input_password = "") {
    try {
        if (input_password === "") { throw 'Password must NOT be empty'; }
        if (fs.existsSync (credentials_file)) { throw 'Credentials were already set'; }

        let new_salt = bcrypt.genSaltSync (10);
        let new_hash = bcrypt.hashSync (input_password, new_salt);
        let new_credentials = JSON.stringify ({salt: new_salt, hash: new_hash});

        fs.writeFileSync (credentials_file, new_credentials);

        if (!verifyCredentials (input_password)) {
            throw 'Something went wrong while creating credentials';
        }
    } catch (err) {
        console.error (err);
    }
};

const verifyCredentials = function (verify_password = "") {
    try {
        if (verify_password === "") { throw 'Password must NOT be empty'; }
        if (!fs.existsSync (credentials_file)) { throw 'Credentials were not yet set'; }

        let credentials = JSON.parse (fs.readFileSync (credentials_file));

        if (bcrypt.compareSync (verify_password, credentials.hash)) {
            return true;
        }

        return false;
    } catch (err) {
        console.error (err);
        return false;
    }
};

const getSalt = function () {
    try {
        if (!fs.existsSync (credentials_file)) { throw 'Credentials were not yet set'; }
        let credentials = JSON.parse (fs.readFileSync (credentials_file));

        return credentials.salt;
    } catch (err) {
        console.error (err);
    }
};

// Use as standalone script to create credentials:
// node sprintplankPassport.js create $PASSWORD

if (process.argv.length === 4 && process.argv[2] === "create") {
    let input_pwd = process.argv [3];
    createCredentials (input_pwd);
}

module.exports.verifyCredentials = verifyCredentials;
module.exports.getSalt = getSalt;