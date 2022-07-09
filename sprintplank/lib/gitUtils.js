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
const path = require('path');
const git = require('nodegit');
const exec = require('child_process').execSync;
const spawn = require('child_process').spawn;
const repo_path = path.join(__dirname, '../repo.git');
const repo_remote = path.join(__dirname, '../../preview.git');
const signature = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../git.json'))
);

var checkRepo = function () {
  console.log(' + + Verify if local repo is up to date.');
  let repository, last_on_preview, last_on_origin;

  new Promise(function (resolve, reject) {
    if (!fs.existsSync(repo_path)) {
      console.log('Creating repository directory');
      fs.mkdirSync(repo_path);
    }

    if (fs.readdirSync(repo_path).length == 0) {
      let repo, preview_ref;
      git
        .Clone(repo_remote, repo_path, { checkoutBranch: 'master' })
        .then(function () {
          console.log('Cloning repository');

          return git.Repository.open(repo_path);
        })
        .then(function (got_repo) {
          repo = got_repo;

          return repo.getBranchCommit('origin/preview');
        })
        .then(function (origin_commit) {
          return repo.createBranch('preview', origin_commit, false);
        })
        .then(function (ref) {
          preview_ref = ref;

          return repo.checkoutBranch(preview_ref, {});
        })
        .then(function () {
          return git.Branch.setUpstream(preview_ref, 'origin/preview');
        })
        .then(function () {
          console.log('Checking out branch Preview');
        })
        .then(function (resolve) {
          resolve();
        });
    } else {
      resolve();
    }
  })
    .then(function () {
      return gitRemoteUpdate();
    })
    .then(function () {
      return git.Repository.open(repo_path);
    })
    .then(function (repo) {
      repository = repo;

      return repository.getReference('preview');
    })
    .then(function (ref) {
      let is_preview = git.Branch.isCheckedOut(ref);

      if (is_preview == 0) {
        return repository.checkoutBranch(ref, {});
      } else {
        return;
      }
    })
    .then(function () {
      return repository.getBranchCommit('preview');
    })
    .then(function (commit) {
      last_on_preview = commit.date();

      return repository.getBranchCommit('origin/preview');
    })
    .then(function (commit) {
      last_on_origin = commit.date();
    })
    .then(function () {
      if (last_on_preview < last_on_origin) {
        console.log('Local branch is behind... performing merges.');

        return repository.fetchAll().then(function () {
          repository.mergeBranches('preview', 'origin/preview');
        });
      }
    });
};

var checkStatus = async function () {
  let repo = await git.Repository.open(repo_path);
  let modified_files = await repo.getStatus();

  if (modified_files.length > 0) {
    return true;
  } else {
    return false;
  }
};

var checkMerge = async function () {
  let repo = await git.Repository.open(repo_path);
  let preview_commit = await repo.getBranchCommit('preview');
  let master_commit = await repo.getBranchCommit('master');
  if (!master_commit.id().equal(preview_commit.id())) {
    return true;
  } else {
    return false;
  }
};

var getStatus = async function () {
  try {
    let status = {
      conflicted: [],
      deleted: [],
      ignored: [],
      modified: [],
      new: [],
      renamed: [],
      typechange: [],
    };

    let repo = await git.Repository.open(repo_path);
    let all_files = await repo.getStatus();

    all_files.forEach((file) => {
      let file_name = file.path().split('/').pop();
      if (file.isConflicted()) {
        status.conflicted.push(file_name);
      }
      if (file.isDeleted()) {
        status.deleted.push(file_name);
      }
      if (file.isIgnored()) {
        status.ignored.push(file_name);
      }
      if (file.isModified()) {
        status.modified.push(file_name);
      }
      if (file.isNew()) {
        status.new.push(file_name);
      }
      if (file.isRenamed()) {
        status.renamed.push(file_name);
      }
      if (file.isTypechange()) {
        status.deleted.push(file_name);
      }
    });

    return status;
  } catch (err) {
    console.log(err);
  }
};

var getServiceStatus = async function () {
  try {
    let aedifico = exec(
      'systemctl --lines 0 status aedifico.service'
    ).toString();
    let aedifico_preview = exec(
      'systemctl --lines 0 status aedifico-preview.service'
    ).toString();

    return { aedifico: aedifico, preview: aedifico_preview };
  } catch (err) {
    console.log(err);
  }
};

var commitToPreview = async function () {
  try {
    let repo, commit_index, tree_oid;
    let author = git.Signature.now(signature.name, signature.email);

    git.Repository.open(repo_path)
      .then(function (got_repo) {
        repo = got_repo;

        return repo.refreshIndex();
      })
      .then(function (got_index) {
        commit_index = got_index;

        return commit_index.addAll();
      })
      .then(function () {
        return commit_index.write();
      })
      .then(function () {
        return commit_index.writeTree();
      })
      .then(function (got_tree_oid) {
        tree_oid = got_tree_oid;

        return repo.getHeadCommit();
      })
      .then(function (head_commit) {
        repo.createCommit(
          'HEAD',
          author,
          author,
          'Sprintplank commit ',
          tree_oid,
          [head_commit]
        );
      })
      .then(function () {
        return gitPushPreview();
      })
      .then(function () {
        return gitPushPreview();
      });
  } catch (err) {
    console.log(err);
  }
};

var commitToMaster = async function () {
  try {
    let repo;

    git.Repository.open(repo_path)
      .then(function (got_repo) {
        repo = got_repo;

        return repo.getReference('master');
      })
      .then(function (ref) {
        console.log('Checkout master');

        return repo.checkoutBranch(ref, {});
      })
      .then(function () {
        console.log('Merge master');

        return repo.mergeBranches('master', 'preview');
      })
      .then(function () {
        console.log('Push master');

        return gitPushMaster();
      })
      .then(function () {
        return gitPushMaster();
      })
      .then(function () {
        return repository.getReference('preview');
      })
      .then(function (ref) {
        console.log('Checkout preview');

        return repository.checkoutBranch(ref, {});
      });
  } catch (err) {
    console.log(err);
  }
};

var gitPushPreview = function () {
  return new Promise(function (resolve, reject) {
    let error_message;
    let proc = spawn('git', ['-C', repo_path, 'push', 'origin', 'preview']);

    proc.on('exit', function (exit_code) {
      if (exit_code === 0) {
        checkRepo();
        resolve();
      } else {
        reject('Failed to push to remote.');
      }
    });
  });
};

var gitPushMaster = function () {
  return new Promise(function (resolve, reject) {
    let error_message;
    let proc = spawn('git', ['-C', repo_path, 'push', 'origin', 'master']);

    proc.on('exit', function (exit_code) {
      if (exit_code === 0) {
        checkRepo();
        console.log('Pushed to master');
        resolve();
      } else {
        reject('Failed to push to remote.');
      }
    });
  });
};

var gitRemoteUpdate = function () {
  return new Promise(function (resolve, reject) {
    let error_message;
    let proc = spawn('git', ['-C', repo_path, 'remote', 'update']);

    proc.on('exit', function (exit_code) {
      if (exit_code === 0) {
        resolve();
        console.log('Remote updated');
      } else {
        reject('Failed to update remote.');
      }
    });
  });
};

module.exports.checkRepo = checkRepo;
module.exports.checkStatus = checkStatus;
module.exports.checkMerge = checkMerge;
module.exports.getStatus = getStatus;
module.exports.getServiceStatus = getServiceStatus;
module.exports.commitToPreview = commitToPreview;
module.exports.commitToMaster = commitToMaster;
