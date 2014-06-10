from __future__ import absolute_import
import os
from promptly import Form
from promptly import console
from . import vcs
from cookiecutter import generate as cookiecutter_generate
from cookiecutter import find as cookiecutter_find
from cookiecutter import hooks as cookiecutter_hooks
from cookiecutter import utils as cookiecutter_utils
from .config import get_cookiecutter_config
from .compat import iteritems
from . import filesystem
from . import config


def template(
    input_dir,
    checkout=None,
    config_dict=None,
    no_input=False):

    config_dict = config_dict or get_cookiecutter_config()

    cookiecutter(input_dir=input_dir,
       checkout=checkout,
       config_dict=config_dict,
       no_input=no_input)


def ensure_repo(input_dir, checkout=None, config_dict={}):
    if "git@" in input_dir or "https://" in input_dir:
        # check if folder exists, if so prompt to pull

        tail = os.path.split(input_dir)[1]
        repo_dir = os.path.normpath(os.path.join(config_dict['cookiecutters_dir'], tail.rsplit('.git')[0]))
        update_repo(
            repo_dir=repo_dir,
            vcs_repo=input_dir,
            config_dict=config_dict)
    else:
        repo_dir = input_dir

    return repo_dir


def load_context(repo_dir):
    context_file = config.context_file_for_path(repo_dir)

    if not context_file:
        return None, None

    filename, filext = os.path.splitext(context_file)
    filename = os.path.basename(filename)

    if filename == 'cookiecutter':
        context = cookiecutter_generate.generate_context(
            context_file=context_file
        )
    elif filename == 'agency':
        context = filesystem.load_yaml(context_file)

    return filename, context


def prompt_with_context_and_style(context, style, defaults={}):
    cookiecutter_dict = {}
    context = context or {}

    if style == 'cookiecutter':
        cookiecutter_dict = prompt_for_config_cookiecutter(context)
    elif style == 'agency':
        # if any base item is already defined int he defaults, don't ask for that info
        base = context.get('base', {})
        for i in xrange(len(base) - 1, -1, -1):
            try:
                key = base[i]['key']
                if key in defaults:
                    del base[i]
            except KeyError:
                pass
        cookiecutter_dict = prompt_for_config_agency(context)

    cookiecutter_dict.update(defaults)
    context['cookiecutter'] = cookiecutter_dict

    return context


def run_pre_gen_hook(repo_dir, cwd='.', context={}):
    with cookiecutter_utils.work_in(repo_dir):
        cookiecutter_hooks.run_hook('pre_gen_project', cwd, context)


def run_post_gen_hook(repo_dir, cwd='.', context={}):
    with cookiecutter_utils.work_in(repo_dir):
        cookiecutter_hooks.run_hook('post_gen_project', cwd, context)


def render_and_create_dir(dirname, context):
    return cookiecutter_generate. \
           render_and_create_dir(dirname, context)


def find_base_template_dir(repo_dir):
    base = cookiecutter_find.find_template(repo_dir)

    # if this fails it will raise an exception
    # and stop the program executeion
    cookiecutter_generate.ensure_dir_is_templated(base)
    return base


def generate_files(src_dir, dest_dir, context=None):

    cookiecutter_generate.generate_files(
        src_dir=src_dir,
        dest_dir=dest_dir,
        context=context)


def cookiecutter(input_dir, checkout=None, config_dict={}, no_input=False):
    repo_dir = ensure_repo(input_dir, checkout, config_dict)
    template_dir = find_base_template_dir(repo_dir)

    style, context = load_context(repo_dir)

    if no_input == False:
        defaults = config_dict.get('default_context', {})
        context = prompt_with_context_and_style(context, style, defaults)

    base_name = os.path.join(
        '.', os.path.split(template_dir)[1])

    # create the initial destination directory
    # we will use this for the rest of the process
    # so we know where to send files
    base_project_dir = render_and_create_dir(base_name, context)

    base_project_dir = os.path.abspath(base_project_dir)

    run_pre_gen_hook(
        repo_dir,
        cwd=base_project_dir,
        context=context)

    generate_files(
        src_dir=template_dir,
        dest_dir=base_project_dir,
        context=context)

    run_post_gen_hook(
        repo_dir,
        cwd=base_project_dir,
        context=context)


def update_repo(repo_dir, vcs_repo, config_dict, checkout=None):
    if filesystem.directory_exists(repo_dir):
        console.notification('Bringing \'%s\' up to date.' % repo_dir, prefix='[notice] ')
        console.notification('One moment...\n', prefix='[notice] ')
        vcs.pull(repo_dir)
    else:
        console.notification('Cloning \'%s\'' % vcs_repo, prefix='[notice] ')
        console.notification('One moment...\n', prefix='[notice] ')

        repo_dir = vcs.clone(
            repo_url=vcs_repo,
            checkout=checkout,
            clone_to_dir=config_dict['cookiecutters_dir'],
            hide_output=True
        )

    return repo_dir


def prompt_for_config_cookiecutter(context):
    """
    Prompts the user to enter new config, using context as a source for the
    field names and sample values.
    """
    cookiecutter_dict = {}
    form = Form()
    for key, val in iteritems(context['cookiecutter']):
        form.add.string(key, 'Enter value for \'%s\'' % key, default=val)

    console.run(form)
    cookiecutter_dict.update(dict(form))
    return cookiecutter_dict


def form_for_agency_yaml(context):
    form = Form()
    actions = form.add

    for each in context['base']:
        args = []

        kind = each['kind']
        key = each.get('key')  # notifications will not have a key
        label = each['label']
        default = each.get('default', None)
        notifications = each.get('notifications', ())

        if kind == 'select':
            choices = each['choices']
            args.append(choices)

        field = getattr(actions, kind)
        if kind == 'notification':
            field(label=label)
        else:
            field(key, label, *args, notifications=notifications, default=default)

    return form


def prompt_for_config_agency(context):
    cookiecutter_dict = {}

    try:
        cookiecutter_dict.update(context['defaults'])
    except KeyError:
        pass

    form = form_for_agency_yaml(context)

    console.run(form)
    cookiecutter_dict.update(dict(form))
    return cookiecutter_dict
