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

import os, sys, time, subprocess, shutil, socket, swissknife
from pathlib import Path

# Initial Checks
swissknife.is_sudo ()
swissknife.is_in_path ()

# Set initial vars
user_uid = int (os.environ['SUDO_UID'])
user_gid = int (os.environ['SUDO_GID'])
base_path = Path.cwd ().parent

# Script arguments
if len (sys.argv) > 1:
    if sys.argv [1] == '--uninstall' or sys.argv [1] == '-u' :
        uninstall = swissknife.ask_question ('\n This script will uninstall Aedifico from your system.\n\n' \
                            + ' -- Would you like to proceed? [y/n]: ', ['y','n'], True)
        if uninstall != 'y':
            print ('\n Exiting installer ...\n')
            sys.exit (0)

        subprocess.call (['systemctl', 'stop', 'aedifico.service'])
        subprocess.call (['systemctl', 'stop', 'aedifico-preview.service'])
        subprocess.call (['systemctl', 'stop', 'aedifico-sprintplank.service'])
        subprocess.call (['systemctl', 'stop', 'aedifico-update.timer'])
        subprocess.call (['systemctl', 'disable', 'aedifico.service'])
        subprocess.call (['systemctl', 'disable', 'aedifico-preview.service'])
        subprocess.call (['systemctl', 'disable', 'aedifico-sprintplank.service'])
        subprocess.call (['systemctl', 'disable', 'aedifico-update.timer'])
        Path (base_path.joinpath ('.git_hash')).unlink ()
        Path ('/usr/bin/aedifico').unlink ()
        Path ('/usr/bin/aedifico-preview').unlink ()
        Path ('/usr/bin/aedifico-sprintplank').unlink ()
        Path ('/etc/systemd/system/aedifico.service').unlink ()
        Path ('/etc/systemd/system/aedifico-preview.service').unlink ()
        Path ('/etc/systemd/system/aedifico-sprintplank.service').unlink ()
        Path ('/etc/systemd/system/aedifico-update.service').unlink ()
        Path ('/etc/systemd/system/aedifico-update.timer').unlink ()
        if Path ('/etc/systemd/system/certbot-renewal.timer').exists ():
            subprocess.call (['systemctl', 'stop', 'certbot-renewal.timer'])
            subprocess.call (['systemctl', 'disable', 'certbot-renewal.timer'])
            Path ('/etc/systemd/system/certbot-renewal.timer').unlink ()
        if Path ('/etc/systemd/system/certbot-renewal.service').exists ():
            Path ('/etc/systemd/system/certbot-renewal.service').unlink ()
        ufw_80 = subprocess.Popen (['ufw', 'deny', '80'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        ufw_80.wait ()
        ufw_443 = subprocess.Popen (['ufw', 'deny', '443'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        ufw_443.wait ()
        ufw_3000 = subprocess.Popen (['ufw', 'deny', '3000'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        ufw_3000.wait ()
        ufw_2083 = subprocess.Popen (['ufw', 'deny', '2083'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        ufw_2083.wait ()
        print ('\n\n -- All files removed! See ya . . . \n\n')
        sys.exit (0)
    elif sys.argv [1] == '--version' or sys.argv [1] == '-v' :
        current_git_hash = None

        if base_path.joinpath ('.git_hash').exists () :
            git_hash_file = open (base_path.joinpath ('.git_hash'))
            current_git_hash = git_hash_file.read ()
            git_hash_file.close ()
        elif subprocess.run (['git', 'rev-parse', 'HEAD'], capture_output=True).returncode == 0 :
            current_git_hash = subprocess.getoutput ('git rev-parse HEAD')

        print ('  Aedifico (https://github.com/raibtoffoletto/aedifico)')

        if current_git_hash != None :
            print (f'  Current git hash: {current_git_hash}')
        else :
            print ('  No version info at this moment. Try to reclone the repo. ')

        print ('\n  Copyright (c) 2019 Raí B. Toffoletto (https://toffoletto.me)')
        print ('  License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.')
        print ('  This is free software: you are free to change and redistribute it.')
        print ('  There is NO WARRANTY, to the extent permitted by law.')
        print ('\n  Written by Raí B. Toffoletto <rai@toffoletto.me>.')

        sys.exit (0)
    elif sys.argv [1] == '--help' or sys.argv [1] == '-h' :
        print ('\n  Usage: sudo python3 install.py [--uninstall] [--version] [--help]')
        print ('  This script install Aedifico in your server.\n')
        print ('    -u, --uninstall   removes all system files installed by this installer')
        print ('    -v, --version     displays git\'s hash for this version\n')
        print ('    -h, --help        displays this information\n')
        sys.exit (0)
    else:
        print ('  Try sudo python3 install.py --help for more information.\n')
        sys.exit (0)        

# Get consent
firstrun_alert = swissknife.ask_question ('\n This script will install a new instance of Aedifico,\n' \
                    + ' a NodeJS web framework for your ubuntu/debian server.\n\n' \
                    + ' ** IT WILL ACCESS ROOT LEVEL SERVICES **\n\n' \
                    + ' -- Would you like to proceed? [y/n]: ', ['y', 'n'], True)

if firstrun_alert.lower ().strip () != 'y':
    print ('\n Exiting installer ...\n')
    sys.exit (0)

print ('')

# Updates the system
apt_update = subprocess.Popen (['apt', 'update'], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Updating your system', apt_update)
time.sleep (5)
apt_upgrade = subprocess.Popen (['apt', 'full-upgrade', '-y'], \
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Upgrading your system', apt_upgrade)

# Install necessary packages
apt_install = subprocess.Popen (['apt', 'install', '-y', 'curl', 'software-properties-common', 'ufw', 'certbot', \
                                'redis-server', 'coreutils'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Installing dependencies', apt_install)

# Add NodeJS v12 repository
# NodeGIT does not support v14 yet.
curl_node = subprocess.Popen (['curl', '-sL', 'https://deb.nodesource.com/setup_12.x'], stdout=subprocess.PIPE, \
                                stderr=subprocess.PIPE)
bash_node = subprocess.Popen (['bash'], stdin=curl_node.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
curl_node.stdout.close ()
swissknife.loading_cmd ('Adding NodeJS repository for Debian/Ubuntu', bash_node)
apt_update = subprocess.Popen (['apt', 'update'], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Updating your system', apt_update)
time.sleep (5)
node_install = subprocess.Popen (['apt', 'install', '-y', 'nodejs=12.*'], \
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Installing NodeJS v12.x', node_install)

# Install npm packages
npm_install = subprocess.Popen (['npm', 'install'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Installing npm packages', npm_install)

# Stores the current git hash.
git_hash = open (base_path.joinpath ('.git_hash'), 'w')
git_hash.write (subprocess.getoutput ('git rev-parse HEAD'))
git_hash.close ()
os.chmod (base_path.joinpath ('.git_hash'), 0o600)

# Removes the .git directory
print (' Cleaning up git.')
if base_path.joinpath ('.git').exists ():
    shutil.rmtree (base_path.joinpath ('.git'))

if base_path.joinpath ('.gitignore').exists ():
    base_path.joinpath ('.gitignore').unlink ()

# Credentials
user_gitconfig = Path (os.path.expanduser ('~' + os.environ['SUDO_USER'])).joinpath ('.gitconfig')

if base_path.joinpath ('./sprintplank/git.json').exists ():
    base_path.joinpath ('./sprintplank/git.json').unlink ()
if user_gitconfig.exists ():
    user_gitconfig.unlink ()

print (' Configuring git signature')
git_name = swissknife.ask_question ('       Name : ')
git_email = swissknife.ask_question ('     E-mail : ')
git_file = open (base_path.joinpath ('./sprintplank/git.json'), 'w')
git_file.write ('{\"name\":\"' + git_name + '\",\"email\":\"' + git_email + '\"}')
git_file.close ()
git_configfile = open (user_gitconfig, 'w')
git_configfile.write ('[user]\n    name = ' + git_name + '\n    email = ' + git_email + '\n')
git_configfile.close ()
os.chmod (user_gitconfig, 0o644)
os.chown (user_gitconfig, user_uid, user_gid)

if base_path.joinpath ('./sprintplank/credentials.json').exists ():
    base_path.joinpath ('./sprintplank/credentials.json').unlink ()
sprintplank_password = swissknife.get_password ()
create_credentials = subprocess.Popen (['node', '../sprintplank/sprintplankPassport.js', 'create', \
                                        sprintplank_password], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Creating credentials', create_credentials)
os.chmod (base_path.joinpath ('./sprintplank/credentials.json'), 0o400)

# Check out git
git_repo = str (base_path.joinpath ('preview.git'))

if base_path.joinpath ('website').exists ():
    shutil.rmtree (base_path.joinpath ('website'))
base_path.joinpath ('website').mkdir ()

if base_path.joinpath ('preview').exists ():
    shutil.rmtree (base_path.joinpath ('preview'))
base_path.joinpath ('preview').mkdir ()

git_master = subprocess.Popen (['git', '--work-tree=' + str (base_path.joinpath ('website')), '--git-dir=' + \
                                git_repo, 'checkout', '-f', 'master'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Website Git: Checking out master', git_master)

git_preview = subprocess.Popen (['git', '--work-tree=' + str (base_path.joinpath ('preview')), '--git-dir=' + \
                                git_repo, 'checkout', '-f', 'preview'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Website Git: Checking out preview', git_preview)

os.chown (user_gitconfig, user_uid, user_gid)
for root, dirs, files in os.walk (base_path):
    for base_dir in dirs:
        os.chown (os.path.join (root, base_dir), user_uid, user_gid)
    for base_file in files:
        os.chown (os.path.join (root, base_file), user_uid, user_gid)

# Ask for certificates
certs = swissknife.ask_question ('\n Would you like to get SSL certificates from letsencrypt\n' \
                       + ' (a real domain with active records to this server is required)\n' \
                       + ' or would you like to use a self signed openssl?\n [letsencrypt/openssl] : ',
                       ['letsencrypt', 'openssl'], True)

if base_path.joinpath ('./bin/certs').exists ():
    shutil.rmtree (base_path.joinpath ('./bin/certs'))

base_path.joinpath ('./bin/certs').mkdir ()

if certs == 'letsencrypt':
    certbot_mail = swissknife.ask_question ('\n    E-mail*: ')
    certbot_domains = swissknife.ask_question ('\n    Domains (separate by commas [,]): ')
    certbot_cmd = subprocess.Popen (['certbot', 'certonly', '--standalone', '-n', '--agree-tos', '--config-dir',
                                    './certs/', '-m', certbot_mail, '-d', certbot_domains],
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd ('   Creating a letsencrypt certificate', certbot_cmd)
    ssl_key = './certs/live/' + certbot_domains.split (',')[0] + '/privkey.pem'
    ssl_csr = './certs/live/' + certbot_domains.split (',')[0] + '/fullchain.pem'

elif certs == 'openssl':
    openssl_c = swissknife.ask_question ('\n    Country * [ex: GB] : ', ['GB'])
    openssl_st = swissknife.ask_question ('    State [ex: London] : ', ['London'])
    openssl_l = swissknife.ask_question ('    Location [ex: London] : ', ['London'])
    openssl_o = swissknife.ask_question ('    Organization [ex: Security, Inc] : ', ['Security, Inc'])
    openssl_ou = swissknife.ask_question ('    Organizational Unit [ex: IT Department] : ', ['IT Department'])
    openssl_cn = swissknife.ask_question ('    Common Name * [ex: example.com] : ', ['example.com'])
    openssl_credentials = '/C='+openssl_c+'/ST='+openssl_st+'/L='+openssl_l+'/O='+openssl_o \
                            +'/OU='+openssl_ou+'/CN='+openssl_cn

    openssl_args = ['openssl', 'req', '-newkey', 'rsa:4096', '-nodes', '-keyout', 'certs/openssl.key', '-x509', \
                    '-days', '365', '-out', 'certs/openssl.csr', '-subj', openssl_credentials]

    openssl_cmd = subprocess.Popen (openssl_args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd ('   Creating an openssl certificate', openssl_cmd)
    ssl_key = './certs/openssl.key'
    ssl_csr = './certs/openssl.csr'

print ('\n Creating SSL configuration.')
ssl_file = open (base_path.joinpath ('./bin/ssl_config.js'), 'w')
ssl_file.write ("var fs = require ('fs');\nvar path = require('path');\n\n")
ssl_file.write ("exports.certs = {\n    key: fs.readFileSync (path.resolve (__dirname, '")
ssl_file.write (ssl_key)
ssl_file.write ("')),\n    cert: fs.readFileSync (path.resolve (__dirname, '")
ssl_file.write (ssl_csr)
ssl_file.write ("'))\n}\n")
ssl_file.close ()
os.chown (base_path.joinpath ('./bin/ssl_config.js'), user_uid, user_gid)
os.chmod (base_path.joinpath ('./bin/ssl_config.js'), 0o600)
os.chmod (base_path.joinpath ('./bin', ssl_key), 0o644)
os.chmod (base_path.joinpath ('./bin', ssl_csr), 0o644)

# SystemD services
print (' Creating Systemd services . . .')
os.chmod (base_path.joinpath ('./bin/www'), 0o755)
os.chmod (base_path.joinpath ('./bin/preview'), 0o755)
os.chmod (base_path.joinpath ('./sprintplank/sprintplank'), 0o755)
os.symlink(base_path.joinpath ('./bin/www'), '/usr/bin/aedifico')
os.symlink(base_path.joinpath ('./bin/preview'), '/usr/bin/aedifico-preview')
os.symlink(base_path.joinpath ('./sprintplank/sprintplank'), '/usr/bin/aedifico-sprintplank')

aedifico_file = open (Path ('/etc/systemd/system/aedifico.service'), 'w')
aedifico_file.write ('[Unit]\nDescription=NodeJS custom web server\nWants=network-online.target\n')
aedifico_file.write ('After=network.target network-online.target\n\n[Service]\nType=simple\n')
aedifico_file.write ('ExecStart=/usr/bin/aedifico\n\n[Install]\nWantedBy=multi-user.target\n')
aedifico_file.close ()
os.chmod (Path ('/etc/systemd/system/aedifico.service'), 0o644)
aedifico_enable = subprocess.Popen (['systemctl', 'enable', 'aedifico.service'], \
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Enabling systemd aedifico.service', aedifico_enable)
aedifico_start = subprocess.Popen (['systemctl', 'start', 'aedifico.service'], \
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Starting systemd aedifico.service', aedifico_start)

preview_file = open (Path ('/etc/systemd/system/aedifico-preview.service'), 'w')
preview_file.write ('[Unit]\nDescription=NodeJS custom web server\nWants=network-online.target\n')
preview_file.write ('After=network.target network-online.target\n\n[Service]\nType=simple\n')
preview_file.write ('ExecStart=/usr/bin/aedifico-preview\n\n[Install]\nWantedBy=multi-user.target\n')
preview_file.close ()
os.chmod (Path ('/etc/systemd/system/aedifico-preview.service'), 0o644)
preview_enable = subprocess.Popen (['systemctl', 'enable', 'aedifico-preview.service'], \
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Enabling systemd aedifico-preview.service', preview_enable)
preview_start = subprocess.Popen (['systemctl', 'start', 'aedifico-preview.service'], \
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Starting systemd aedifico-preview.service', preview_start)

sprintplank_file = open (Path ('/etc/systemd/system/aedifico-sprintplank.service'), 'w')
sprintplank_file.write ('[Unit]\nDescription=NodeJS custom web server\nWants=network-online.target\n')
sprintplank_file.write ('After=network.target network-online.target\n\n[Service]\nType=simple\n')
sprintplank_file.write (f'User={user_uid}\nGroup={user_gid}\n')
sprintplank_file.write ('ExecStart=/usr/bin/aedifico-sprintplank\n\n[Install]\nWantedBy=multi-user.target\n')
sprintplank_file.close ()
os.chmod (Path ('/etc/systemd/system/aedifico-sprintplank.service'), 0o644)
sprintplank_enable = subprocess.Popen (['systemctl', 'enable', 'aedifico-sprintplank.service'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Enabling systemd aedifico-sprintplank.service', sprintplank_enable)
sprintplank_start = subprocess.Popen (['systemctl', 'start', 'aedifico-sprintplank.service'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Starting systemd aedifico-sprintplank.service', sprintplank_start)

print (' Setting sudo priviledges for user ' + os.environ['SUDO_USER'])
sudoers_file = open (Path ('/etc/sudoers'), 'a')
sudoers_file.write ('\n' + os.environ['SUDO_USER'] + '   ' + socket.gethostname() \
                    + '=(root) NOPASSWD: /bin/systemctl\n')
sudoers_file.write ('\n' + os.environ['SUDO_USER'] + '   ' + socket.gethostname() \
                    + f'=(root) NOPASSWD: {base_path.joinpath ("bin","update.py")}\n')
sudoers_file.close ()
os.chmod (base_path.joinpath ('bin','update.py'), 0o755)

if certs == 'letsencrypt':
    certbot_file = open (Path ('/etc/systemd/system/certbot-renewal.service'), 'w')
    certbot_file.write ('[Unit]\nDescription=Certbot Renewal\n\n[Service]\nType=oneshot\n')
    certbot_file.write ('ExecStart=/usr/bin/certbot renew --standalone ')
    certbot_file.write (f'--config-dir {base_path.joinpath ("./bin/certs")}')
    certbot_file.write ('--pre-hook "systemctl stop aedifico.service" ')
    certbot_file.write ('--post-hook "systemctl start aedifico.service" ')
    certbot_file.write ('--deploy-hook "systemctl restart aedifico-preview.service" ')
    certbot_file.write ('--deploy-hook "systemctl restart aedifico-sprintplank.service" ')
    certbot_file.write ('--quiet\n')
    certbot_file.close ()
    os.chmod (Path ('/etc/systemd/system/certbot-renewal.service'), 0o644)

    certbot_timer = open (Path ('/etc/systemd/system/certbot-renewal.timer'), 'w')
    certbot_timer.write ('[Unit]\nDescription=Timer for Certbot Renewal\n\n[Timer]\nOnCalendar=*-*-* 3:43:00\n')
    certbot_timer.write ('RandomizedDelaySec=55m\nPersistent=true\n\n[Install]\nWantedBy=timers.target\n')
    certbot_timer.close ()
    os.chmod (Path ('/etc/systemd/system/certbot-renewal.timer'), 0o644)

    certbot_enable = subprocess.Popen (['systemctl', 'enable', 'certbot-renewal.timer'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd ('Enabling systemd certbot-renewal.timer', certbot_enable)
    certbot_start = subprocess.Popen (['systemctl', 'start', 'certbot-renewal.timer'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd ('Starting systemd certbot-renewal.timer', certbot_start)

update_file = open (Path ('/etc/systemd/system/aedifico-update.service'), 'w')
update_file.write ('[Unit]\nDescription=Aedifico self update\n\n[Service]\nType=oneshot\n')
update_file.write (f'User={user_uid}\nGroup={user_gid}\n')
update_file.write (f'WorkingDirectory={base_path.joinpath ("bin")}\n')
update_file.write (f'ExecStart=sudo {base_path.joinpath ("bin", "update.py")}\n')
update_file.close ()
os.chmod (Path ('/etc/systemd/system/aedifico-update.service'), 0o644)
update_timer = open (Path ('/etc/systemd/system/aedifico-update.timer'), 'w')
update_timer.write ('[Unit]\nDescription=Timer for Aedifico update\n\n[Timer]\nOnCalendar=*-*-* 1:37:00\n')
update_timer.write ('RandomizedDelaySec=55m\nPersistent=true\n\n[Install]\nWantedBy=timers.target\n')
update_timer.close ()
os.chmod (Path ('/etc/systemd/system/aedifico-update.timer'), 0o644)
update_enable = subprocess.Popen (['systemctl', 'enable', 'aedifico-update.timer'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Enabling systemd aedifico-update.timer', update_enable)
update_start = subprocess.Popen (['systemctl', 'start', 'aedifico-update.timer'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('Starting systemd aedifico-update.timer', update_start)

# Firewall
print ('\n\n Configuring your firewall . . .')
ssh_port = swissknife.ask_question ('    What\'s your SSH port? [default: 22] ', ['22'])
ufw_ssh = subprocess.Popen (['ufw', 'allow', ssh_port], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
ufw_ssh.wait ()
ufw_80 = subprocess.Popen (['ufw', 'allow', '80'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
ufw_80.wait ()
ufw_443 = subprocess.Popen (['ufw', 'allow', '443'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
ufw_443.wait ()
ufw_3000 = subprocess.Popen (['ufw', 'allow', '3000'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
ufw_3000.wait ()
ufw_2083 = subprocess.Popen (['ufw', 'allow', '2083'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
ufw_2083.wait ()

say_yes = subprocess.Popen(['yes'], stdout=subprocess.PIPE)
enable_ufw = subprocess.Popen (['ufw', 'enable'], stdin=say_yes.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd ('   Enabling UncomplicatedFirewall', enable_ufw)

print ('\n\n Installation finished with success!!\n')
print (' Services are online, now you can clone the website repository\n at '+ \
        git_repo +' and start having fun with it.')
print ('\n Happy coding. ;)\n\n')