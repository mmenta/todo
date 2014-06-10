import os
from promptly import console
from agency import config
from agency import filesystem
from agency import vcs


def run():
    data_directory = config.data_directory()
    agency_directory = config.agency_directory()

    if not filesystem.directory_exists(agency_directory):
        filesystem.mkdir_p(agency_directory)

    prefix = '[notice] '
    if not filesystem.directory_exists(data_directory):
        console.notification(
            'It appears you are missing some things.',
            prefix=prefix)

        console.notification(
            'Let me fix that for you.',
            prefix=prefix)

        console.notification(
            'This may take a moment.\n',
            prefix=prefix)

        dir_name, target_name = os.path.split(data_directory)
        filesystem.mkdir_p(dir_name)
        vcs.clone(config.data_url(), clone_to_dir=dir_name, name=target_name)

    else:
        console.notification(
            'Making sure everything is up to date.',
            prefix=prefix)
        vcs.pull(data_directory)

    console.notification(
        'All done! Lets get started\n',
        prefix=prefix)
