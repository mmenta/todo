import re
import unicodedata
from .random import get_random_string
from . import config
from . import filesystem
from . import template


def slugify(value):
    """
    Converts to lowercase, removes non-word characters (alphanumerics and
    underscores) and converts spaces to hyphens. Also strips leading and
    trailing whitespace.

    See http://docs.python.org/2/library/unicodedata.html for
    unicodedata.normalize()

    This is a slightly modified version from django.utils.text.slugify
    https://github.com/django/django/blob/master/django/utils/text.py#L405-L413
    """
    value = unicodedata.normalize('NFKD', unicode(value)) \
                       .encode('ascii', 'ignore') \
                       .decode('ascii')

    value = re.sub('[^\w\s-]', '', value).strip().lower()
    return re.sub('[-\s]+', '-', value)


def sync_cloudseed_states(profile, cloudseed_dir, context={}):

    dest_salt_dir, \
    dest_pillar_dir = config.cloudseed_sync_dirs(cloudseed_dir)

    src_salt_dir, \
    src_pillar_dir = config.data_sync_dirs(profile)

    template.generate_files(
        src_dir=src_salt_dir,
        dest_dir=dest_salt_dir,
        context=context)

    template.generate_files(
        src_dir=src_pillar_dir,
        dest_dir=dest_pillar_dir,
        context=context)

    #filesystem.sync_dirs(src_salt_dir, dest_salt_dir)
    #filesystem.sync_dirs(src_pillar_dir, dest_pillar_dir)


def random_string():
    '''
    This is lifted from the django source
    https://github.com/django/django/blob/86f4459f9e3c035ec96578617605e93234bf2700/django/core/management/commands/startproject.py#L27-L29
    '''
    # Create a random SECRET_KEY hash to put it in the main settings.
    chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
    return get_random_string(50, chars)
