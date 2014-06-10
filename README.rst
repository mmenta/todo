===============================
Agency Tools
===============================

.. image:: https://badge.fury.io/py/agency.png
    :target: http://badge.fury.io/py/agency

.. image:: https://travis-ci.org/aventurella/agency.png?branch=master
        :target: https://travis-ci.org/aventurella/agency

.. image:: https://pypip.in/d/agency/badge.png
        :target: https://crate.io/packages/agency?version=latest


Agency Project Tools

* Free software: BSD license
* Documentation: http://agency.rtfd.org.

Features
--------

* TODO


Requirements
--------
* python
* pip
* git
* vagrant (Note: You MUST be using vagrant 1.3.4+ and you MUST have the salt-vagrant plugin removed)

Quick Start
--------
 run these commands::
 
    git clone git@github.com:blitzagency/agency-automation-tools.git
    cd agency-automation-tools
    python ./setup.py develop
    devbot go


Windows
--------

Check out more windows tips here: /docs/windows-getting-started.md

When using a repo created by the devbot that uses cloudseed you'll need to account for the unix style symlink that's created.  Because there's no easy way store a windows symlink in git, we'll need to convert the unix symlink into a windows link any time we want to use project and interact with git.  One solution to this was found here: http://www.stackoverflow.com/questions/5917249/git-symlinks-in-windows/16754068#16754068. The quick start version is below:

Add these git aliases to your git config::

    git config --global alias.rm-symlink '!__git_rm_symlink(){ git checkout -- "$1"; link=$(echo "$1"); POS=$'\''/'\''; DOS=$'\''\\\\'\''; doslink=${link//$POS/$DOS}; dest=$(dirname "$link")/$(cat "$link"); dosdest=${dest//$POS/$DOS}; if [ -f "$dest" ]; then rm -f "$link"; cmd //C mklink //H "$doslink" "$dosdest"; elif [ -d "$dest" ]; then rm -f "$link"; cmd //C mklink //J "$doslink" "$dosdest"; else echo "ERROR: Something went wrong when processing $1 . . ."; echo "       $dest may not actually exist as a valid target."; fi; }; __git_rm_symlink "$1"'

    git config --global alias.rm-symlinks '!__git_rm_symlinks(){ for symlink in `git ls-files -s | egrep "^120000" | cut -f2`; do git rm-symlink "$symlink"; git update-index --assume-unchanged "$symlink"; done; }; __git_rm_symlinks'

    git config --global alias.checkout-symlinks '!__git_checkout_symlinks(){ POS=$'\''/'\''; DOS=$'\''\\\\'\''; for symlink in `git ls-files -s | egrep "^120000" | cut -f2`; do git update-index --no-assume-unchanged "$symlink"; dossymlink=${symlink//$POS/$DOS}; cmd //C rmdir //Q "$dossymlink" 2>/dev/null; git  checkout -- "$symlink"; echo "Restored git symlink $symlink <<===>> `cat $symlink`"; done; }; __git_checkout_symlinks'


Before vagrant up or before you use the site, you'll need to convert the symlinks from unix to windows. Do this by running "git rm-symlinks" from the root of the repo. Be careful committing in this state as you could inadvertanly pollute the repo if you git add -A. Convert it back to unix style by running "git
checkout-symlinks".
