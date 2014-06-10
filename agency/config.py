from __future__ import absolute_import
import os
from confypy import Config
from confypy import Location
from cloudseed.utils import config as cloudseed_config
from . import filesystem

CONFIG = None


def context_file_for_path(path):
    cookiecutter = os.path.join(path, 'cookiecutter.json')
    agency = os.path.join(path, 'agency.yaml')

    if filesystem.file_exists(agency):
        return agency

    if filesystem.file_exists(cookiecutter):
        return cookiecutter


def agency_directory():
    config_dict = get_cookiecutter_config()
    return config_dict['cookiecutters_dir']


def data_directory():
    return os.path.join(agency_directory(), 'data')


def data_url():
    config = load_config()
    return config['data_url']


def get_cookiecutter_config():
    config = {
    'cookiecutters_dir': os.path.expanduser('~/.agency/'),
    'default_context': {}
    }
    return config


def data_sync_dirs(profile):
    src_data = data_directory()
    salt_dir = os.path.join(src_data, profile, 'salt')
    pillar_dir = os.path.join(src_data, profile, 'pillar')

    if not filesystem.directory_exists(salt_dir) or \
       not filesystem.directory_exists(pillar_dir):
        raise Exception

    return salt_dir, pillar_dir


def cloudseed_sync_dirs(cloudseed_base):
    salt_suffix = os.path.join('srv', 'salt')
    pillar_suffix = os.path.join('srv', 'pillar')

    salt_dir = cloudseed_dir(cloudseed_base, salt_suffix)
    pillar_dir = cloudseed_dir(cloudseed_base, pillar_suffix)

    if not filesystem.directory_exists(salt_dir) or \
       not filesystem.directory_exists(pillar_dir):
        raise Exception

    return salt_dir, pillar_dir


def cloudseed_dir(base_dir, path, env='default'):
    return os.path.join(base_dir, env, path)


def load_config(**kwargs):
    global CONFIG

    if CONFIG:
        return CONFIG

    local_settings = os.path.join(os.getcwd(), '.agency')
    defaults = {
        'data_url': 'git@github.com:blitzagency/agency-data.git',
    }

    config = Config(chain=True, defaults=defaults)
    config.locations = [
        Location.from_env_path('AGENCY_SETTINGS', parser='yaml'),
        Location.from_path(local_settings, parser='yaml'),
        Location.from_dict(kwargs)
    ]

    CONFIG = config.data

    return config.data
