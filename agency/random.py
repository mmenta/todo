'''
This is taken from Django's django.utils.crypto
'''
from __future__ import absolute_import
import time
import hashlib
import random


try:
    random = random.SystemRandom()
    using_sysrandom = True
except NotImplementedError:
    using_sysrandom = False


def get_random_string(length=12,
                      allowed_chars='abcdefghijklmnopqrstuvwxyz'
                                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'):
    """
    Returns a securely generated random string.

    The default length of 12 with the a-z, A-Z, 0-9 character set returns
    a 71-bit value. log_2((26+26+10)^12) =~ 71 bits

    https://github.com/django/django/blob/86f4459f9e3c035ec96578617605e93234bf2700/django/utils/crypto.py#L53-L76
    """
    if not using_sysrandom:
        # This is ugly, and a hack, but it makes things better than
        # the alternative of predictability. This re-seeds the PRNG
        # using a value that is hard for an attacker to predict, every
        # time a random string is required. This may change the
        # properties of the chosen random sequence slightly, but this
        # is better than absolute predictability.
        random.seed(
            hashlib.sha256(
                ("%s%s%s" % (
                    random.getstate(),
                    time.time(),
                    '')).encode('utf-8')  # empty string = settings.SECRET_KEY
                ).digest())
    return ''.join([random.choice(allowed_chars) for i in range(length)])
