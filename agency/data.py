import os
import yaml
from . import config
from . import filesystem


def get_profiles():
    path = os.path.join(config.data_directory(), 'profiles.yaml')
    return process_url(path)


def get_ports():
    path = os.path.join(config.data_directory(), 'ports.yaml')
    return process_url(path)


def get_boxes():
    path = os.path.join(config.data_directory(), 'boxes.yaml')
    return process_url(path)


def process_url(path):
    return filesystem.load_yaml(path)
