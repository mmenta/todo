import sys
_ver = sys.version_info

is_py2 = (_ver[0] == 2)
is_py3 = (_ver[0] == 3)

if is_py2:
    iterkeys = dict.iterkeys
    iteritems = dict.iteritems
    unicode = unicode

elif is_py3:
    iterkeys = dict.keys
    iteritems = dict.items
    unicode = str

