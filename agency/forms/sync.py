import os
from promptly import Form
from agency.compat import iterkeys
from agency import config
from agency import filesystem
from agency import template


def build_form(profile_id=None, data_profiles=None):
    form = Form()

    if not profile_id:
        keys = sorted(tuple(iterkeys(data_profiles)))
        choices = ['%s [%s]' % (x, data_profiles[x]['label'])
                   for x in keys]

        form.add.select(
        'profile_id',
        'Choose the profile you would like to sync',
        choices)

    form.add.branch(profile_questions_branch, profile_id=profile_id)

    form.add.bool('confirm',
        '** WARNING ** This operation will copy files\n'
        'overwriting existing files of the same name.\n\n'
        'Should I proceed?',
         default=False)

    return form


def questions_for_profile(profile_id):
    data = config.data_directory()
    profile_dir = os.path.join(data, profile_id)
    agency_yaml = os.path.join(profile_dir, 'agency.yaml')

    questions = {}

    if filesystem.directory_exists(profile_dir) and \
       filesystem.file_exists(agency_yaml):
        questions = filesystem.load_yaml(agency_yaml)

    return questions


def profile_questions_branch(form=None, profile_id=None):
    if not profile_id:
        profile_id = form.profile_id.value[1].split(' ', 1)[0].strip()

    questions = questions_for_profile(profile_id)

    if questions:
        return template.form_for_agency_yaml(questions)

    return None


