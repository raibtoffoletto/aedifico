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

import os, sys, time, subprocess, shutil, swissknife, patch
from pathlib import Path

def stop_services ():
    aedifico_stop = subprocess.Popen (['systemctl', 'stop', 'aedifico.service'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd (' Stopping systemd aedifico.service', aedifico_stop)
    preview_stop = subprocess.Popen (['systemctl', 'stop', 'aedifico-preview.service'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd (' Stopping systemd aedifico-preview.service', preview_stop)
    sprintplank_stop = subprocess.Popen (['systemctl', 'stop', 'aedifico-sprintplank.service'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd (' Stopping systemd aedifico-sprintplank.service', sprintplank_stop)

def start_services ():
    aedifico_start = subprocess.Popen (['systemctl', 'start', 'aedifico.service'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd (' Starting systemd aedifico.service', aedifico_start)
    preview_start = subprocess.Popen (['systemctl', 'start', 'aedifico-preview.service'], \
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd (' Starting systemd aedifico-preview.service', preview_start)
    sprintplank_start = subprocess.Popen (['systemctl', 'start', 'aedifico-sprintplank.service'], \
                                            stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    swissknife.loading_cmd (' Starting systemd aedifico-sprintplank.service', sprintplank_start)

def get_update_list ():
    file_list = []
    for root, dirs, files in os.walk (git_new_tree):
        for file in files:
            if file != 'update.py':
                path_to_replace = f'{git_new_tree}/'
                file_list.append (os.path.join (root, file).replace (path_to_replace,''))
        for dir in dirs:
            if Path (root).joinpath (dir).exists () is False:
                os.makedirs (Path (root).joinpath (dir))
                os.chown (Path (root).joinpath (dir), user_uid, user_gid)
                os.chmod (Path (root).joinpath (dir), 0o644)
    return file_list

# Initial Checks
swissknife.is_sudo ()
swissknife.is_in_path ()

# Set initial vars
user_uid = int (os.environ['SUDO_UID'])
user_gid = int (os.environ['SUDO_GID'])
base_path = Path.cwd ().parent
git_new_tree = base_path.joinpath ('.git-update')

# Get local hash
current_git_hash = None

if base_path.joinpath ('.git_hash').exists () :
    git_hash_file = open (base_path.joinpath ('.git_hash'))
    current_git_hash = git_hash_file.read ()
    git_hash_file.close ()

if current_git_hash == None and subprocess.run (['git', 'rev-parse', 'HEAD'], capture_output=True).returncode == 0 :
    print ('  You should install `aedifico` first before updating it.')
    sys.exit (0)

if current_git_hash == None :
    print ('  Could not define current version...\n  Please re-install `aedifico` manually.')
    sys.exit (0)

# Get official repo hash
repository_hash = subprocess.getoutput ('git ls-remote https://github.com/raibtoffoletto/aedifico.git \
                                        refs/heads/master | cut -f 1')

# Updates the system
apt_update = subprocess.Popen (['apt', 'update'], stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
swissknife.loading_cmd (' Updating your system', apt_update)
time.sleep (3)
apt_upgrade = subprocess.Popen (['apt', 'full-upgrade', '-y'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd (' Upgrading your system', apt_upgrade)

if current_git_hash == repository_hash:
    print ('  Aedifico is up to date!\n  Nothing to do here...')
    sys.exit (0)

print ('  Performing updates.\n  The website will be down for a few minutes...\n')

# Stop services
stop_services ()

# Git checkout and clean up
if git_new_tree.exists () :
    shutil.rmtree (git_new_tree)

git_checkout = subprocess.Popen (['git', 'clone', '-b', 'master', \
                                  'https://github.com/raibtoffoletto/aedifico.git', f'{git_new_tree}'], \
                                  stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd (' Checking out new tree', git_checkout)

git_new_hash = subprocess.getoutput (f'git ls-remote {git_new_tree} refs/heads/master | cut -f 1')

shutil.rmtree (git_new_tree.joinpath ('.git'))
shutil.rmtree (git_new_tree.joinpath ('preview.git'))
Path (git_new_tree.joinpath ('.gitignore')).unlink ()

# Check if this script is up-to-date
update_file_current = base_path.joinpath ('bin', 'update.py')
update_file_repo = git_new_tree.joinpath ('bin', 'update.py')
patch_file_current = base_path.joinpath ('bin', 'patch.py')
patch_file_repo = git_new_tree.joinpath ('bin', 'patch.py')
update_file_current_sha = subprocess.getoutput (f'sha256sum {update_file_current}').split ()
update_file_repo_sha = subprocess.getoutput (f'sha256sum {update_file_repo}').split ()
patch_file_current_sha = subprocess.getoutput (f'sha256sum {patch_file_current}').split ()
patch_file_repo_sha = subprocess.getoutput (f'sha256sum {patch_file_repo}').split ()

if update_file_current_sha[0] != update_file_repo_sha[0] :
    shutil.move (update_file_repo, update_file_current)
    os.chown (update_file_current, user_uid, user_gid)
    os.chmod (update_file_current, 0o755)
    start_services ()
    print ('\n  This script just got updated, please run it again.')
    sys.exit (0)
elif patch_file_current_sha[0] != patch_file_repo_sha[0] :
    shutil.move (patch_file_repo, patch_file_current)
    os.chown (patch_file_current, user_uid, user_gid)
    os.chmod (patch_file_current, 0o644)
    start_services ()
    print ('\n  This script just got updated, please run it again.')
    sys.exit (0)

# Update files and permissions
print ('\n  Copying new files:')
files_to_move = get_update_list ()
executables = ['bin/www','bin/preview','sprintplank/sprintplank']

for file in files_to_move :
    print (f'    ../{file}')
    shutil.move (git_new_tree.joinpath (file), base_path.joinpath (file))
    os.chown (base_path.joinpath (file), user_uid, user_gid)
    if file in executables:
        os.chmod (base_path.joinpath (file), 0o755)
    else :
        os.chmod (base_path.joinpath (file), 0o644)

# Update Node's packages
if base_path.joinpath ('node_modules').exists () :
    shutil.rmtree (base_path.joinpath ('node_modules'))
if base_path.joinpath ('package-lock.json').exists () :
    Path (base_path.joinpath ('package-lock.json')).unlink ()

npm_update = subprocess.Popen (['npm', 'install'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
swissknife.loading_cmd (' Performing NPM updates', npm_update)

# Performing patches
patched = patch.patch_install ()
if patched :
    print ('  Patches applied successfully.')

# Update git hash:
print (f'  Git\'s new hash: {git_new_hash}')
git_hash = open (base_path.joinpath ('.git_hash'), 'w')
git_hash.write (git_new_hash)
git_hash.close ()
os.chmod (base_path.joinpath ('.git_hash'), 0o600)

# Starting services
start_services ()
