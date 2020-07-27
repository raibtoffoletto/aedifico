#!/usr/bin/env python3
#####################################################################
#                                                                   #
# Copyright (c) 2019 Raí B. Toffoletto (https://toffoletto.me)      #
#                                                                   #
# This program is free software; you can redistribute it and/or     #
# modify it under the terms of the GNU General Public               #
# License as published by the Free Software Foundation; either      #
# version 2 of the License, or (at your option) any later version.  #
#                                                                   #
# This program is distributed in the hope that it will be useful,   #
# but WITHOUT ANY WARRANTY; without even the implied warranty of    #
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU #
# General Public License for more details.                          #
#                                                                   #
# You should have received a copy of the GNU General Public         #
# License along with this program; if not, write to the             #
# Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,  #
# Boston, MA 02110-1301 USA                                         #
#                                                                   #
# Authored by: Raí B. Toffoletto <rai@toffoletto.me>                #
#                                                                   #
#####################################################################

import sys, time
from getpass import getpass
from termios import tcflush, TCIFLUSH

# Swissknife functions
def loading_cmd (message,waiting_cmd):
    while waiting_cmd.poll () is None:
        chars = "|/—\\"
        for char in chars:
            time.sleep (0.3)
            sys.stdout.write ('\r ' + message + ' ' + char)
            sys.stdout.flush ()
    if waiting_cmd.returncode > 0:
        print ('\n Error while running command:')
        print (waiting_cmd.stderr.read ().decode ())
        sys.exit (1)
    sys.stdout.write ('\r ' + message + ', done!\n')

def ask_question (message, answers = [], strict = False):
    tcflush(sys.stdin, TCIFLUSH)
    user_input = (input (message)).lower ().strip ()
    if len(answers) != 0:
        if strict:
            while not user_input in answers:
                tcflush(sys.stdin, TCIFLUSH)
                user_input = (input (message)).lower ().strip ()
            return user_input

        return (user_input if user_input != "" else answers[0])
    else:
        while user_input == "":
            tcflush(sys.stdin, TCIFLUSH)
            user_input = (input (message)).lower ().strip ()
        return user_input

def get_password ():
    passwd_same = False
    while passwd_same != True:
        passwd = getpass ('\n Create an administrative password: ')
        passwd_check = getpass ('                  Confirm password: ')
        if passwd != passwd_check:
            print(' Passwords didn\'t mach, try again...')
        else:
            passwd_same = True
    return passwd