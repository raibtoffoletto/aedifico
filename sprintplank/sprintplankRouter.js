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

const fs = require('fs');
const path = require ('path');
const router = require ('express').Router ();
const fileUtils = require ('./src/fileUtils');
const gitUtils = require ('./src/gitUtils');
const multer = require ('multer');

const media_storage = multer.diskStorage ({
    destination: function (req, file, cb) {
        cb (null, fileUtils.getMediaFiles ().path);
    },
    filename: function (req, file, cb) {
        cb (null , fileUtils.sanitize (file.originalname));
    }
});
const media_upload = multer ({storage: media_storage});

gitUtils.checkRepo ();

function defaultMetadata () {
    this.path = ['~'];
    this.showSearch = false;
    this.editor = false;
    this.date = false;
    this.file = null;
    this.markdown_editor = false;
    this.showSearch = false;
    this.edit_menu = false;
    this.css_files = fileUtils.getCSS ();
    this.css_path = fileUtils.getCssPath ();
    this.js_files = fileUtils.getJS ();
    this.js_path = fileUtils.getJsPath ();
    this.views_files = fileUtils.getViews ();
    this.views_path = fileUtils.getViewsPath ();
    this.appjs = fileUtils.getAppJS ();
};

//  === static files ===
router.get ('/favicon.ico', function (req, res, next) {
    res.sendFile (path.join (__dirname, 'src/favicon.png'));
});

router.get ('/bootstrap.css', function (req, res, next) {
    res.sendFile (path.join (__dirname, 'src/bootstrap-sb-admin.css'));
});

router.get ('/fontawesome.css', function (req, res, next) {
    res.sendFile (require.resolve ('@fortawesome/fontawesome-free/css/all.min.css'));
});

router.get ('/simplemde.css', function (req, res, next) {
    res.sendFile (require.resolve ('simplemde/dist/simplemde.min.css'));
});

router.get (/^\/webfonts\/fa-solid*/, function (req, res, next) {
    res.sendFile (require.resolve ('@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff'));
});

router.get (/^\/webfonts\/fa-brands*/, function (req, res, next) {
    res.sendFile (require.resolve ('@fortawesome/fontawesome-free/webfonts/fa-brands-400.woff'));
});

router.get ('/jquery.js', function (req, res, next) {
    res.sendFile (require.resolve ('jquery/dist/jquery.min.js'));
});

router.get ('/jquery-easing.js', function (req, res, next) {
    res.sendFile (require.resolve ('jquery.easing/jquery.easing.min.js'));
});

router.get ('/jquery-ui.js', function (req, res, next) {
    res.sendFile (require.resolve ('jquery-ui-dist/jquery-ui.min.js'));
});

router.get ('/bootstrap.js', function (req, res, next) {
    res.sendFile (require.resolve ('bootstrap/dist/js/bootstrap.bundle.min.js'));
});

router.get ('/bootstrap.bundle.min.js.map', function (req, res, next) {
    res.sendFile (require.resolve ('bootstrap/dist/js/bootstrap.bundle.min.js.map'));
});

router.get ('/simplemde.js', function (req, res, next) {
    res.sendFile (require.resolve ('simplemde/dist/simplemde.min.js'));
});

router.get ('/codemirror.css', function (req, res, next) {
    res.sendFile (require.resolve ('codemirror/lib/codemirror.css'));
});

router.get ('/codemirror.js', function (req, res, next) {
    res.sendFile (require.resolve ('codemirror/lib/codemirror.js'));
});

router.get ('/codemirror-javascript.js', function (req, res, next) {
    res.sendFile (require.resolve ('codemirror/mode/javascript/javascript.js'));
});

//  === main routes ===
router.get (/^\/pages[\/]?$/, function (req, res, next) {
  if (req.query ['f']) {
        let edit_page_metadata = new defaultMetadata ();
            edit_page_metadata.path = ['~', 'content', 'pages', 'editor'];
            edit_page_metadata.file = req.query ['f'];
            edit_page_metadata.editor = true;
            edit_page_metadata.markdown_editor = true;

        res.render ('edit-file', edit_page_metadata);
    } else {
        let page_metadata = new defaultMetadata ();
            page_metadata.path = ['~', 'content', 'pages'];
            page_metadata.showSearch = true;
            page_metadata.pages = fileUtils.getPages ();

        res.render ('list-pages', page_metadata);
    }
});

router.get (/^\/posts[\/]?$/, function (req, res, next) {
    if (req.query ['f']) {
        let edit_post_metadata = new defaultMetadata ();
            edit_post_metadata.path = ['~', 'content', 'posts', 'editor'];
            edit_post_metadata.file = req.query ['f'];
            edit_post_metadata.editor = true;
            edit_post_metadata.date = true;
            edit_post_metadata.markdown_editor = true;

        res.render ('edit-file', edit_post_metadata);
    } else {
        let post_metadata = new defaultMetadata ();
            post_metadata.path = ['~', 'content', 'posts'];
            post_metadata.showSearch = true;
            post_metadata.posts = fileUtils.getPosts ();

        res.render ('list-posts', post_metadata);
    }
});

router.get (/^\/multimedia[\/]?$/, function (req, res, next) {
    let media_metadata = new defaultMetadata ();
        media_metadata.path = ['~', 'content', 'multimedia'];
        media_metadata.showSearch = true;
        media_metadata.media = fileUtils.getMediaFiles ();

    res.render ('list-multimedia', media_metadata);
});

router.get (/^\/menu[\/]?$/, function (req, res, next) {
    let menu_metadata = new defaultMetadata ();
        menu_metadata.path = ['~', 'content', 'menu'];
        menu_metadata.edit_menu = true;
        menu_metadata.menu_objects = fileUtils.getMenu ();

    res.render ('menu', menu_metadata);
});

router.get (/^\/edit-raw[\/]?$/, function (req, res, next) {
    if (req.query ['f']) {
        let edit_raw_metadata = new defaultMetadata ();
        edit_raw_metadata.path = ['~', 'editor'];
        edit_raw_metadata.file = req.query ['f'];
        edit_raw_metadata.editor = true;

        res.render ('edit-file', edit_raw_metadata);
    } else {
        next ();
    }
});

router.get (/^\/new[\/]?$/, function (req, res, next) {
    if (req.query ['d'] && req.query ['t']) {
        var new_file;

        if (!req.query ['p'] == "") {
            new_file = fileUtils.createNewFile (req.query ['d'], req.query ['t']);
        } else {
            new_file = fileUtils.createNewFile (req.query ['d'], req.query ['t'], true);
        }

        if (new_file) {
            res.writeHead (301, {'Location': 'https://' + req.headers['host'] + '/' + req.query ['p']});
            res.end ();
        } else {
            next ();
        }
    } else {
        next ();
    }

});

router.get ('/download/:file', function (req, res, next) {
    if (req.query ['f']) {
        res.sendFile (req.query ['f']);
    } else {
        next ();
    }
});

router.get (/^\/delete[\/]?$/, function (req, res, next) {
    if (req.query ['f']) {
        fs.unlinkSync (req.query ['f']);

        res.writeHead (301, {'Location': 'https://' + req.headers['host'] + '/' + req.query ['p']});
        res.end ();
    } else {
        next ();
    }
});

router.get (/^\/getfile[\/]?$/, function (req, res, next) {
    if (req.query ['f']) {
        let raw_file = false;

        if (req.query ['t'] == "raw") {
            raw_file = true;
        }

        res.send (new fileUtils.getFile (req.query ['f'], raw_file));
    } else {
        next ();
    }
});

router.get (/^\/getmenu[\/]?$/, function (req, res, next) {
    res.send (new fileUtils.getMenu ());
});

router.get ('/', function (req, res, next) {
    let aedifico, aedifico_preview, git_status;

    gitUtils.getStatus ().then (function (got_status) {
        git_status = got_status;

        return gitUtils.getServiceStatus ();
    }).then (function (services) {
        aedifico = services.aedifico;
        aedifico_preview = services.preview;

        return gitUtils.checkStatus ();
    }).then (function (check_status) {
        let index_metadata = new defaultMetadata ();
            index_metadata.pages = fileUtils.getPagesLenght ();
            index_metadata.posts = fileUtils.getPostsLenght ();
            index_metadata.media = fileUtils.getMediaFilesLenght ();
            index_metadata.status = git_status;
            index_metadata.check_status = check_status;
            index_metadata.aedifico = aedifico;
            index_metadata.aedifico_preview = aedifico_preview;

        res.render ('index', index_metadata);
    });
});

router.get ('/logoff', function (req, res, next) {
    req.session.lock = 'lock';
    res.writeHead (301, {'Location': 'https://' + req.headers['host'] + '/'});
    res.end ();
});

router.get ('/checkStatus', function (req, res, next) {
    gitUtils.checkStatus ().then (function (git_status) {
        if (git_status) {
            res.status (200).end ();
        } else {
            res.status (500).end ();
        }
    });
});

router.get ('/commitToPreview', function (req, res, next) {
    gitUtils.commitToPreview ().then (function () {
        res.status (200).end ();
    });
});

router.get ('/checkMerge', function (req, res, next) {
    gitUtils.checkMerge ().then (function (merge_status) {
        if (merge_status) {
            res.status (200).end ();
        } else {
            res.status (500).end ();
        }
    });
});

router.get ('/commitToMaster', function (req, res, next) {
    gitUtils.commitToMaster ().then (function () {
        res.status (200).end ();
    });
});

router.post ('/upload/media', media_upload.single ('file'), (req, res) => {
    try {
        res.status (200).end ();
    } catch (err) {
        res.status (404).end ();
    }
});

router.post (/^\/save[\/]?$/, (req, res) => {
    if (req.body.file == null || req.body.markdown == null || req.body.content == null) {
        res.status (404).end ();
    } else {
        var update_file = false;

        if (req.body.markdown == "true") {
            update_file = fileUtils.updateFile (req.body.file,
                                                req.body.content,
                                                true,
                                                req.body.title,
                                                req.body.date);
        } else {
            update_file = fileUtils.updateFile (req.body.file,
                                                req.body.content);
        }

        if (!update_file) {
            res.status (404).end ();
        } else {
            res.status (200).end ();
        }
    }
});

router.post (/^\/updatemenu[\/]?$/, (req, res) => {
    if (req.body.menu == "null" || typeof req.body.menu == "undefined") {
        res.status (404).end ();
    } else {
        var update_menu = false;
            update_menu = fileUtils.updateMenu (JSON.parse (req.body.menu));

        if (!update_menu) {
            res.status (404).end ();
        } else {
            res.status (200).end ();
        }
    }
});

module.exports = router;