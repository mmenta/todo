#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys
import agency

from setuptools import setup

if sys.argv[-1] == 'publish':
    os.system('python setup.py sdist upload')
    sys.exit()


def strip_comments(l):
    return l.split('#', 1)[0].strip()


def reqs(*f):
    return list(filter(None, [strip_comments(l) for l in open(
        os.path.join(os.getcwd(), 'requirements', *f)).readlines()]))

install_requires = reqs('default.txt')
tests_require = ['nose']

dependency_links = [
   'https://github.com/aventurella/cookiecutter/tarball/dev#egg=cookiecutter-dev',
   'https://github.com/cloudseed-project/cloudseed2/tarball/simple#egg=cloudseed-dev',
   'https://github.com/aventurella/cookiecutter_django_secret/tarball/master#egg=cookiecutter_django_secret-0.1.0',
   'https://github.com/aventurella/cookiecutter_wordpress_secret/tarball/master#egg=cookiecutter_wordpress_secret-0.1.0',
]


packages = [
    'agency',
    'agency.cli',
    'agency.forms'
]

readme = open('README.rst').read()
history = open('HISTORY.rst').read().replace('.. :changelog:', '')
setup(
    name='agency',
    version=agency.__version__,
    description='Agency Automation Tools: Featuring Devbot',
    long_description=readme + '\n\n' + history,
    author='Dino Petrone <dpetrone@blitzagency.com>, Adam Venturella <aventurella@blitzagency.com>',
    author_email='dpetrone@blitzagency.com, aventurella@blitzagency.com',
    url='https://github.com/blitzagency/agency',
    packages=packages,
    package_dir={'agency': 'agency'},
    include_package_data=True,
    install_requires=install_requires,
    dependency_links=dependency_links,
    license="BSD",
    zip_safe=False,
    keywords='agency',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        "Programming Language :: Python :: 2",
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
    ],
    tests_require=tests_require,
    test_suite='tests',

    entry_points={
        'console_scripts': [
            'devbot = agency.cli.main:main',
        ]
    }
)
