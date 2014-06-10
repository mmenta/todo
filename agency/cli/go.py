'''
usage:
  devbot go [options]

options:
  -n <name>, --name=<name>           Name of the project to initialize
  -p <profile>, --profile=<profile>  Enable port forwarding for the specified ports
  -g, --bridge                       Enable Bridged Networking
  -h, --help                         Show this screen.
  -s, --salt-version=<salt>          Set the salt version to use [default: v2014.1.4]


'''
import os
import logging
from docopt import docopt
from promptly import console
from cloudseed import actions as cloudseed_actions
from agency.forms import go
from agency.forms import sync
from agency import template
from agency import utils
from agency import config
from agency import filesystem
from agency.cli import preamble

log = logging.getLogger(__name__)


def run(argv):
    args = docopt(__doc__, argv=argv)
    preamble.run()

    config_dict = config.get_cookiecutter_config()

    path = os.getcwd()
    data = go.run(
        name=args.get('--name'),
        profile_id=args.get('--profile'))

    mapped_folders = [
        {'host': 'cloudseed/current/srv/', 'guest': '/srv/'}
    ]

    if data['folders']:
        mapped_folders += data['folders']

    project_name = utils.slugify(data['project_name'])

    config_dict['default_context']['project_name'] = project_name
    config_dict['default_context']['container_folder'] = 'container'
    config_dict['default_context']['profile_id'] = data['profile_id']

    if data['project_template']:
        context = build_template(
            input_dir=data['project_template'],
            config_dict=config_dict,
            include_states=data['include_states'])

    if data['box_id'] and data['os_id']:
        cloudseed_actions.init.run(
                path=path,
                name='default',
                box_id=data['box_id'],
                box_url=data['box_url'],
                ports=data['ports'],
                folders=mapped_folders,
                bridged=args['--bridge'],
                version=args['--salt-version'])

    if data['include_states']:
        utils.sync_cloudseed_states(
            profile=data['profile_id'],
            cloudseed_dir=filesystem.find_folder_up(path, 'cloudseed'),
            context=context)

    console.notification(
            'All done!',
            prefix='[notice] ')

    console.notification(
            'Time to go punch the internet in the face with '
            'your awesomeness!\n\n',
            prefix='[notice] ')


def build_template(input_dir, checkout=None, config_dict={}, output_dir=".", include_states=False):

    repo_dir = template.ensure_repo(input_dir, checkout, config_dict)
    template_dir = template.find_base_template_dir(repo_dir)

    # ask the user questions related to the states
    # and merge those in to the context
    if include_states:
        form = sync.profile_questions_branch(
            profile_id=config_dict['default_context']['profile_id'])

        if form:
            console.run(form)
            config_dict['default_context'].update(dict(form))

    style, context = template.load_context(repo_dir)
    defaults = config_dict.get('default_context', {})

    context = template.prompt_with_context_and_style(
        context, style, defaults)

    base_name = os.path.join(
        '.', os.path.split(template_dir)[1])

    # create the initial destination directory
    # we will use this for the rest of the process
    # so we know where to send files
    base_project_dir = template. \
                       render_and_create_dir(base_name, context)

    base_project_dir = os.path.abspath(base_project_dir)

    console.notification(
            'Generating your project template.',
            prefix='[notice] ')

    console.notification(
            'This may take a while...\n\n',
            prefix='[notice] ')

    template.run_pre_gen_hook(
        repo_dir,
        cwd=base_project_dir,
        context=context)

    template.generate_files(
        src_dir=template_dir,
        dest_dir=base_project_dir,
        context=context)

    template.run_post_gen_hook(
        repo_dir,
        cwd=base_project_dir,
        context=context)

    return context
