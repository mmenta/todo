import os
import shutil
import yaml
from cloudseed.utils import filesystem as cloudseed_filesystem


def file_exists(path):
    return os.path.isfile(path)


def directory_exists(path):
    return os.path.isdir(path)


def mkdir_p(path):
    cloudseed_filesystem.mkdir_p(path)


def load_yaml(path):
    return yaml.load(read_file(path))


def read_file(path):
    return cloudseed_filesystem.read_file(path)


def find_folder_up(start_path, folder_name):
    path = start_path
    _join = os.path.join
    _isdir = os.path.isdir
    _split = os.path.split

    while path:
        candidate = _join(path, folder_name)

        if _isdir(candidate):
            return candidate

        head, tail = _split(path)

        if not tail:
            raise Exception

        path = head


def files(dir_name):
    _join = os.path.join
    _isdir = os.path.isdir

    for each in (x for x in os.listdir(dir_name) if x != '.' or x != '..'):
        name = _join(dir_name, each)
        if not _isdir(name):
            yield name


def fileswalk(dir_name, followlinks=False):
    _join = os.path.join

    for root, _, files in os.walk(
        dir_name,
        followlinks=followlinks):

        for each in files:
            yield _join(root, each)


def sync_dirs(src_dir, dest_dir):
    _join = os.path.join
    _isdir = os.path.isdir
    _copy = shutil.copy2
    _dirname = os.path.dirname

    src_dir = os.path.abspath(src_dir)
    dest_dir = os.path.abspath(dest_dir)

    for src_name in fileswalk(src_dir):
        dest_suffix = src_name[len(src_dir):]

        if dest_suffix[0] == os.sep:
            dest_suffix = dest_suffix[len(os.sep):]

        dest_name = _join(dest_dir, dest_suffix)
        target_dir = _dirname(dest_name)

        if not _isdir(target_dir):
            mkdir_p(target_dir)

        _copy(src_name, dest_name)
