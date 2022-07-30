/*
 * Aedifico framework
 * Copyright 2019 ~ 2022 - Raí Biason Toffoletto <rai@toffoletto.me>
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

const fs = require('fs');
const path = require('path');
const fm = require('front-matter');
const mime = require('mime-types');

var getFile = function (file_path, raw = false) {
  if (!raw) {
    let fm_file = fm(fs.readFileSync(file_path, 'utf8'));
    this.title = fm_file.attributes.title;
    this.date = new Date(fm_file.attributes.date);
    this.tags = fm_file.attributes.tags;
    this.content = fm_file.body;
  } else {
    this.name = path.basename(file_path);
    this.date = new Date(fs.lstatSync(file_path).mtime);
    this.content = fs.readFileSync(file_path, 'utf8');
  }
};

var getFileList = function (dir, subdir = true, last_modified_first = false) {
  const file_list = [];
  const folders = [dir];
  let file_mime;

  do {
    const filepath = folders.pop();
    if (fs.existsSync(filepath)) {
      const file = fs.lstatSync(filepath);

      if (file.isDirectory()) {
        fs.readdirSync(filepath).forEach((f) => {
          sub_file = fs.lstatSync(path.join(filepath, f));
          if (subdir) {
            folders.push(path.join(filepath, f));
          } else if (!subdir && sub_file.isFile()) {
            file_mime = mime.lookup(path.join(dir, f));
            if (!file_mime) {
              file_mime = 'text/plain';
            }

            file_list.push({
              name: f,
              type: mime.lookup(path.join(dir, f)),
              path: path.join(dir, f),
              modify: new Date(sub_file.mtime),
            });
          }
        });
      } else if (file.isFile()) {
        file_mime = mime.lookup(filepath);
        if (!file_mime) {
          file_mime = 'text/plain';
        }

        file_list.push({
          name: path.basename(filepath),
          type: file_mime,
          path: filepath,
          modify: new Date(file.mtime),
        });
      }
    }
  } while (folders.length !== 0);

  file_list.sort(function (a, b) {
    if (last_modified_first) {
      return b.modify - a.modify;
    }
    return a.path - b.path;
  });

  return file_list;
};

var getPages = function () {
  let pages = { path: path.join(__dirname, '../repo.git/public/content') };
  pages.list = [];
  let files = getFileList(pages.path, false);
  files.forEach((f) => {
    if (f.name !== 'menu.md') {
      let file_metadata = fm(fs.readFileSync(f.path, 'utf8')).attributes;
      let page = f;
      page.title = file_metadata.title;
      page.date =
        f.modify.getFullYear() +
        '/' +
        f.modify.getMonth() +
        '/' +
        f.modify.getDate() +
        ' at ' +
        f.modify.getHours() +
        ':' +
        f.modify.getMinutes();
      pages.list.push(page);
    }
  });

  return pages;
};

var getPagesLenght = function () {
  return getPages().list.length;
};

var getPosts = function () {
  let posts = {
    path: path.join(__dirname, '../repo.git/public/content/posts'),
  };
  posts.list = [];
  let files = getFileList(posts.path, true, true);
  files.forEach((f) => {
    let file_metadata = fm(fs.readFileSync(f.path, 'utf8')).attributes;
    let post = f;
    post.title = file_metadata.title;
    post.date =
      f.modify.getFullYear() +
      '/' +
      f.modify.getMonth() +
      '/' +
      f.modify.getDate() +
      ' at ' +
      f.modify.getHours() +
      ':' +
      f.modify.getMinutes();
    posts.list.push(post);
  });

  return posts;
};

var getPostsLenght = function () {
  return getPosts().list.length;
};

var getMediaFiles = function () {
  let media = { path: path.join(__dirname, '../repo.git/public/img') };
  media.list = [];

  if (!fs.existsSync(media.path)) {
    fs.mkdirSync(media.path);
  }

  getFileList(media.path).forEach((f) => {
    f.thumbnail = false;

    if (f.type.split('/')[0] === 'image') {
      f.thumbnail = true;
    }

    f.date =
      f.modify.getFullYear() +
      '/' +
      f.modify.getMonth() +
      '/' +
      f.modify.getDate() +
      ' at ' +
      f.modify.getHours() +
      ':' +
      f.modify.getMinutes();

    media.list.push(f);
  });

  return media;
};

var getMediaFilesLenght = function () {
  return getMediaFiles().list.length;
};

var getMenu = function () {
  let menu_file = path.join(__dirname, '../repo.git/public/content/menu.md');
  let menu_object = fm(fs.readFileSync(menu_file, 'utf8')).attributes;
  let menu = [];
  let menu_links = [];
  let pages = [];

  for (let [item, link] of Object.entries(menu_object)) {
    menu.push({ item: item, link: link });
    menu_links.push(link);
  }

  getPages().list.forEach((e) => {
    let e_link = menu_links.indexOf('/' + e.name.slice(0, e.name.length - 3));

    if (e_link == -1 && e.name != 'index.md') {
      pages.push({
        item: e.title,
        link: '/' + e.name.slice(0, e.name.length - 3),
      });
    }
  });

  if (menu_links.indexOf('/blog') == -1) {
    pages.push({ item: 'Blog', link: '/blog' });
  }

  return { menu: menu, pages: pages };
};

var getCssPath = function () {
  return path.join(__dirname, '../repo.git/public/css');
};

var getCSS = function () {
  return getFileList(getCssPath(), false);
};

var getJsPath = function () {
  return path.join(__dirname, '../repo.git/scripts');
};

var getJS = function () {
  return getFileList(getJsPath(), false);
};

var getViewsPath = function () {
  return path.join(__dirname, '../repo.git/views');
};

var getViews = function () {
  return getFileList(getViewsPath(), false);
};

var getAppJS = function () {
  return path.join(__dirname, '../repo.git/app.js');
};

var createNewFile = function (folder, name, raw = false) {
  let new_file_path;
  let new_file_content = '// new';
  let date_now = new Date();
  let i = 0;
  let extension = '';

  if (!raw) {
    extension = '.md';
    new_file_content =
      '---' +
      '\ntitle: ' +
      name +
      '\ndate: ' +
      date_now.getFullYear() +
      '-' +
      (date_now.getMonth() + 1) +
      '-' +
      date_now.getDate() +
      '\ntags:' +
      '\n---';
  }

  if (!fs.existsSync(folder)) {
    fs.mkdir(folder, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  do {
    new_file_path =
      i == 0
        ? path.join(folder + '/' + sanitize(name) + extension)
        : path.join(folder + '/' + sanitize(name) + '-' + i + extension);
    i++;
  } while (fs.existsSync(new_file_path));

  try {
    fs.writeFileSync(new_file_path, new_file_content);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

var updateFile = function (
  file,
  content,
  markdown = false,
  title = '',
  date = '',
  tags = ''
) {
  let updated_date = new Date(date);
  let updated_content = content;

  if (markdown) {
    updated_content =
      '---' +
      '\ntitle: ' +
      title +
      '\ndate: ' +
      updated_date.getFullYear() +
      '-' +
      (updated_date.getMonth() + 1) +
      '-' +
      updated_date.getDate() +
      '\ntags: ' +
      tags +
      '\n---\n' +
      content;
  }

  try {
    fs.writeFileSync(file, updated_content);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

var updateMenu = function (new_order) {
  var updated_menu = '---';

  new_order.forEach((i) => {
    updated_menu = updated_menu + '\n' + i.item + ': ' + i.link;
  });

  updated_menu = updated_menu + '\n---';

  try {
    fs.writeFileSync(
      path.join(__dirname, '../repo.git/public/content/menu.md'),
      updated_menu
    );

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

var sanitize = function (str) {
  const map = {
    '-': '_',
    a: 'á|à|ã|â|À|Á|Ã|Â',
    e: 'é|è|ê|É|È|Ê',
    i: 'í|ì|î|Í|Ì|Î',
    o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    c: 'ç|Ç',
    n: 'ñ|Ñ',
  };

  str = str.toLowerCase();

  for (var pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  }
  str = str.replace('!', '-');
  str = str.replace('?', '-');
  str = str.replace('`', '-');
  str = str.replace('~', '-');
  str = str.replace('@', '-');
  str = str.replace('#', '-');
  str = str.replace('$', '-');
  str = str.replace('%', '-');
  str = str.replace('^', '-');
  str = str.replace('&', '-');
  str = str.replace('*', '-');
  str = str.replace('(', '-');
  str = str.replace(')', '-');
  str = str.replace('=', '-');
  str = str.replace('+', '-');
  str = str.replace('[', '-');
  str = str.replace('{', '-');
  str = str.replace(']', '-');
  str = str.replace('}', '-');
  str = str.replace(';', '-');
  str = str.replace(':', '-');
  str = str.replace('"', '-');
  str = str.replace("'", '-');
  str = str.replace('\\', '-');
  str = str.replace('|', '-');
  str = str.replace(',', '-');
  str = str.replace('<', '-');
  str = str.replace('>', '-');
  str = str.replace('/', '-');
  str = str.replace(/\s/g, '_');
  str = str.replace(/\-\_/g, '_');

  do {
    str = str.slice(0, -1);
  } while (str.slice(-1) === '-');

  return str;
};

module.exports.createNewFile = createNewFile;
module.exports.updateFile = updateFile;
module.exports.getFile = getFile;
module.exports.getFileList = getFileList;
module.exports.getPagesLenght = getPagesLenght;
module.exports.getPages = getPages;
module.exports.getPostsLenght = getPostsLenght;
module.exports.getPosts = getPosts;
module.exports.getMediaFiles = getMediaFiles;
module.exports.getMediaFilesLenght = getMediaFilesLenght;
module.exports.getMenu = getMenu;
module.exports.updateMenu = updateMenu;
module.exports.getCSS = getCSS;
module.exports.getJS = getJS;
module.exports.getViews = getViews;
module.exports.getCssPath = getCssPath;
module.exports.getJsPath = getJsPath;
module.exports.getViewsPath = getViewsPath;
module.exports.getAppJS = getAppJS;
module.exports.sanitize = sanitize;
