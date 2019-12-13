<!--
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
-->

# Aedifico

> This is a small framework that uses Node's ExpressJS and EJS to render simple websites.
>
> It includes a minimal template with a micro-blogging infrastructure. The website can be deployed via Git or via the included CMS.

# Dependencies and Requirements:
An up and running instance of Ubuntu or Debian server (only x86 architecture at the moment) with secure shell access (SSH) and (*optionally*) domains and DNS records configured. Ports 80, 443, 2083 and 3000 must **not** be in use by any other software. Also, the following packages are required (*and they are usually already installed*):

- git
- python3
- systemd

*Note:* This server do **not** run at `/var/www`, it is good practice to have a dedicated user account set up for it, without direct ssh access (specially if you are running other services in your server). **sudo** privileges will be configured during the install.

### Install:
Clone the repository:

`$ git clone https://github.com/raibtoffoletto/aedifico.git`

Execute the installer and *carefully follow its instructions*:

`$ cd aedifico/bin`
`$ sudo python3 install.py`

### Uninstall:
In the `aedifico/bin` folder, run:

`$ sudo python install.py --uninstall`

### Services:
These are the following *systemd* services in use:

- aedifico.service
- aedifico-preview.service
- aedifico-sprintplank.service

You can check the status of each of them with `systemctl status $SERVICE` and the logs with `journalctl -u $SERVICE`.

*Tip:* To monitor live the status of a service use the program `watch`.

## Deploying your Website:

Aedifico renders your content from markdown files. The `public` folder contains all web related files: pages and blog posts are stored in `content` and `content/posts`; style sheets at `css`; and multimedia files at `img`. The web address for a page is just its file name without the `.md` extension.

### Sprintplank

Sprintplank is the included CMS to help manage your content. You can manage your content and app from it, preview it and then publish it. It is accessible from the port `2083` of your server.

*Note:* The name comes from `dash` and `board` through several iterations on *google translator* from english, to other languages and then back again to english.

### Git
Clone, modify and than push to the git repository `preview.git`.

Use primarily the branch `preview`, you can check all modifications at the port 3000. Any commits to the branch `master` will go directly to production, it is wise to use `preview` to test new content and then merge the branches.

*Note:* Commits to other branches won't affect the website, you may use them as back-ups/archives.

# Acknowledgement:
**Aedifico** is build using several awesome projects.
My heartfelt thanks to:

- [Bootstrap](https://getbootstrap.com)
- [CodeMirror](https://codemirror.net)
- [EJS](https://ejs.co)
- [ExpressJS](https://expressjs.com)
- [Fontawesome](https://fontawesome.com)
- [Front Matter](https://github.com/jxson/front-matter)
- [JQuery](https://jquery.com)
- [Markdown It](https://github.com/markdown-it/markdown-it)
- [Mime Types](https://github.com/jshttp/mime-types)
- [Multer](https://github.com/expressjs/multer)
- [Node bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [NodeGit](https://www.nodegit.org)
- [Sass](https://sass-lang.com)
- [SimpleMDE](https://simplemde.com)