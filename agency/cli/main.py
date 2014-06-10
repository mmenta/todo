from __future__ import absolute_import
import logging
from subprocess import call
from docopt import docopt
from docopt import DocoptExit
import agency


def agency_main():
    '''
usage:
  devbot [--version] [--help]
            <command> [<args>...]

options:
  -h --help                show this screen
  --version                show version


common commands:
    go [options]    start a new project
    sync [options]  sync salt states for a profile
    '''
    args = docopt(
        agency_main.__doc__,
        version=agency.__version__,
        options_first=True)

    command = args['<command>']
    argv = [args['<command>']] + args['<args>']

    initialize_logging(verbose=False)

    if command == 'go':
        from agency.cli import go
        go.run(argv)

    elif command == 'sync':
        from agency.cli import sync
        sync.run(argv)

    elif args['<command>'] in ('help', None):
        exit(call(['agency', command,  '--help']))

    else:
        exit('{0} is not an agency command. See \'agency --help\'.' \
            .format(args['<command>']))


def initialize_logging(verbose=False):
    log_level = logging.DEBUG if verbose else logging.INFO

    logger = logging.getLogger('agency')
    logger.setLevel(log_level)

    console = logging.StreamHandler()
    console.setLevel(log_level)

    formatter = logging.Formatter('[%(levelname)s] : %(name)s - %(message)s')
    console.setFormatter(formatter)
    logger.addHandler(console)


def main():

    try:
        agency_main()
    except DocoptExit:
        exit(call(['cloudseed', '--help']))
    except KeyboardInterrupt:
        pass

