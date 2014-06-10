'''
usage:
  devbot sync [options] [<cloudseed_dir>]

options:
  -p <profile_name>, --profile=<profile_name>  Profile to sync salt states for
  -h, --help                                   Show this screen.


'''

import os
import sys
import logging
from promptly import console
from docopt import docopt
from agency import utils
from agency import data
from agency import filesystem
from agency.forms import sync
from agency.cli import preamble

log = logging.getLogger(__name__)


def run(argv):
    args = docopt(__doc__, argv=argv)

    preamble.run()
    profiles = data.get_profiles()
    profile_id = args.get('--profile')

    path = args['<cloudseed_dir>']

    if path:
        path = os.path.abspath(path)
    else:
        path = filesystem.find_folder_up(os.getcwd(), 'cloudseed')

    if not profile_id:
        form = sync.build_form(profile_id=None, data_profiles=profiles)
    else:
        form = sync.build_form(profile_id=profile_id)

    console.run(form)

    if not profile_id:
        profile_id = form.profile_id.value[1].split(' ', 1)[0].strip()

    if not profiles.get(profile_id):
        sheet = '''
        .prefix {color: red; font-weight:bold;}
        .notification.label {color:white; font-weight:bold;}
        '''
        console.notification(
            'Unable to locate profile \'%s\'\n...\n\n' % profile_id,
            prefix='[error] ',
            stylesheet=sheet)

        sys.exit(0)

    if form.confirm.value:
        context = {'cookiecutter': {
        'database_name': 'my_database',
        'database_username': 'my_username'}}

        utils.sync_cloudseed_states(
            profile=profile_id,
            cloudseed_dir=path,
            context=context)
