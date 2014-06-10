from __future__ import absolute_import
import sys
import os
import subprocess
from cookiecutter import vcs as cookiecutter_vcs
from . import filesystem


def git_repo_name(repo_url):
    tail = os.path.split(repo_url)[1]
    return tail.rsplit('.git')[0]


def repo_name(repo_url):
    kind = identify_repo(repo_url)
    action = getattr(sys.modules[__name__], '%s_repo_name' % kind)
    return action(repo_url)


def identify_repo(repo_url):
    """
    Determines if `repo_url` should be treated as a URL to a git or hg repo.
    :param repo_url: Repo URL of unknown type.
    :returns: "git", "hg", or None.

    This comes straight from cookiecutter 0.7.0 which is unreleased
    and modified clightly as far as the exception that's raised.
    Cookiecutter raises UnknownRepoType in 0.7.0, but that is not
    available in 0.6.4 so we just raise an Exception.

    https://github.com/audreyr/cookiecutter/blob/master/cookiecutter/vcs.py#L40-L52

    When migrating to 0.7.0 replace this function with the following:
    from cookiecutter import vcs as cookiecutter_vcs
    return cookiecutter_vcs.identify_repo(repo_url)
    """

    if 'git' in repo_url:
        return 'git'
    elif 'bitbucket' in repo_url:
        return 'hg'
    else:
        raise Exception


def clone(repo_url, checkout=None, clone_to_dir='.', name=None, hide_output=True):
    """
    Clone a repo to the current directory.

    :param repo_url: Repo URL of unknown type.
    :param checkout: The branch, tag or commit ID to checkout after clone
    :param name: The name of the directory to clone into. If this is None
                 The name will be generated from the repo_url

    This is a modified version of:
    https://github.com/audreyr/cookiecutter/blob/master/cookiecutter/vcs.py#L55-L84
    """

    # Ensure that clone_to_dir exists
    clone_to_dir = os.path.expanduser(clone_to_dir)
    repo_type = identify_repo(repo_url)
    tail = os.path.split(repo_url)[1]

    if repo_type == 'git':
        name = name or tail.rsplit('.git')[0]
        repo_dir = os.path.normpath(os.path.join(clone_to_dir, name))
    elif repo_type == 'hg':
        name = name or tail
        repo_dir = os.path.normpath(os.path.join(clone_to_dir, name))

    if hide_output:
        stdout = stderr = open(os.devnull, 'w')
    else:
        stdout = sys.stdout
        stderr = sys.stderr

    if repo_type in ('git', 'hg'):
        subprocess.check_call(
            [repo_type, 'clone', repo_url, name],
            cwd=clone_to_dir,
            stdout=stdout,
            stderr=stderr)

    if checkout is not None:
        subprocess.check_call(
            [repo_type, 'checkout', checkout],
            cwd=repo_dir,
            stdout=stdout,
            stderr=stderr)

    if hide_output:
        stdout.close()

    return repo_dir


def pull(repo_dir, hide_output=True):
    # this is not a very smart check, =( clearly we only
    # care about git for right now.
    if filesystem.directory_exists('%s/.git' % repo_dir):
        repo_type = 'git'
        cmd = ['git', 'pull']
    else:
        repo_type = 'hg'
        cmd = ['hg', 'pull', '-u']

    if hide_output:
        stdout = stderr = open(os.devnull, 'w')
    else:
        stdout = sys.stdout
        stderr = sys.stderr

    if repo_type in ('git', 'hg'):
        subprocess.check_call(
            cmd,
            cwd=repo_dir,
            stdout=stdout,
            stderr=stderr)

    if hide_output:
        stdout.close()
