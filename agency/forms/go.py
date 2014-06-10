from itertools import chain
from promptly import Form
from promptly import console
from cloudseed.forms.init import build_form as cloudseed_form
from agency.compat import iterkeys
from agency.data import get_boxes, get_ports, get_profiles


def run(name=None, profile_id=None):

    available_ports = {}
    available_boxes = get_boxes()
    available_profiles = get_profiles()
    available_ports = get_ports()

    result = {
    'project_name': name,
    'profile_id': profile_id}

    if profile_id is not None and profile_id != 'custom':
        result.update(process_profile(
            profile_id,
            data_boxes=available_boxes,
            data_profiles=available_profiles,
            data_ports=available_ports
        ))

    form = build_form(
        name=name,
        profile_id=profile_id,
        data_profiles=available_profiles,
        data_boxes=available_boxes,
        data_ports=available_ports)

    if len(form):
        console.run(form)
        data = dict(form)

        if 'name' in data:
            result['project_name'] = data.get('name')

        if 'profile' in data:
            profile_id = data.get('profile', profile_id)[1] \
                             .split(' ', 1)[0] \
                             .strip()

            result['profile_id'] = profile_id

            result.update(process_profile(
                result['profile_id'],
                data_boxes=available_boxes,
                data_profiles=available_profiles,
                data_ports=available_ports,
                data_form=data
            ))

        elif profile_id == 'custom':
            result.update(process_custom_data(
                data,
                data_boxes=available_boxes,
                data_ports=available_ports))

            result['project_template'] = data['project_template']

        if 'include_states' in data:
            result['include_states'] = data.get('include_states', False)
        else:
            result['include_states'] = available_profiles \
                                       .get(profile_id) \
                                       .get('include_states', False)

    return result


def build_form(
    name=None,
    profile_id=None,
    data_profiles={},
    data_boxes={},
    data_ports={}):

    form = Form()

    if not name:
        form.add.string('name', 'Enter Project Name:')

    if not profile_id:
        keys = sorted(tuple(iterkeys(data_profiles)))
        choices = ['%s [%s]' % (x, data_profiles[x]['label'])
                   for x in keys]

        form.add.select('profile', 'Choose Project Profile:', choices)
        form.add.branch(
            branch_custom,
            data_boxes=data_boxes,
            data_ports=data_ports)

        form.add.branch(branch_prompt_for_sync, data_profiles)

    elif profile_id == 'custom':
        form.add.branch(
            branch_custom,
            data_boxes=data_boxes,
            data_ports=data_ports,
            is_custom=True)
    return form


def build_cloudseed_form(form, data_boxes={}, data_ports={}):

    return cloudseed_form(
        data_boxes=data_boxes,
        data_ports=data_ports)


def process_profile(profile_id, data_boxes, data_profiles, data_ports, data_form={}):
    result = {}
    if profile_id == 'custom':
        result = process_custom_data(
            data_form,
            data_boxes,
            data_ports)

        return result

    profile = data_profiles[profile_id]
    box_id = profile.get('cloudseed_box_id')
    os_id = profile.get('cloudseed_os_id')

    result['box_id'] = box_id
    result['os_id'] = os_id

    result['box_url'] = data_boxes[os_id][box_id]['url'] \
                        if os_id and box_id else None

    result['ports'] = profile.get('cloudseed_ports')
    result['folders'] = profile.get('cloudseed_folders')
    result['project_template'] = profile.get('template', None)

    return result


def process_custom_data(data, data_boxes, data_ports):
    key_os = data['os_id'][1]
    key_box, _ = data['box_id'][1].split(' ', 1)

    def map_action(value):
        _, key = value
        ports = data_ports[key]
        return [{'port': x['port'],
                 'label': '%s %s' % (key.lower(), x.get('label', ''))}
                 for x in ports]

    selected_ports = list(chain(
        *map(map_action, data['ports']))
    )

    return {
    'box_id': key_box,
    'os_id': key_os,
    'ports': selected_ports,
    'box_url': data_boxes[key_os][key_box]['url'],
    'folders': (),
    'project_template': data.get('project_template')
    }


def branch_custom(form, data_boxes, data_ports, is_custom=False):

    if is_custom or \
    form.profile.value[1].split(' ', 1)[0].strip() == 'custom':

        branch = Form()
        branch.add.string(
                'project_template',
                'Location of Project Template:')

        branch.add.branch(
            build_cloudseed_form,
            data_boxes=data_boxes,
            data_ports=data_ports)

        return branch


def branch_prompt_for_sync(form, data_profiles):
    # the user was prompted to pick a profile from the
    # available profiles.
    # By the time we get there that selection has happened
    # so the actual profile data SHOULD be available.

    profile_id = form.profile.value[1] \
                     .split(' ', 1)[0] \
                     .strip()
    profile = data_profiles.get(profile_id)

    if not profile:
        # TODO better error handling
        # This case should never happen, but in case it does for
        # some reason, let us know.
        raise Exception

    if 'include_states' not in profile:
        branch = Form()
        branch.add.bool(
            'include_states',
            'Include Salt States For This Profile?',
            default=False)

        return branch
