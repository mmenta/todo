# Getting Started Guide (Linux/Mac)

## Requirements

* Python
* Git
* pip
* virtualenv
* virtualenvwrapper
* SVN
* Vagrant

## Install Prerequisites

Open Terminal and run the following.

```
curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py | sudo python
sudo pip install virtualenv
sudo pip install virtualenvwrapper 
```

Append the following to ```~/.bash_profile``` (or .bashrc, .profile, etc).

```
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Devel
source /usr/local/bin/virtualenvwrapper.sh
```

Then run the following to activate your ```.bash_profile``` and create the virtualenv.

```
source ~/.bash_profile 
mkvirtualenv aat
workon aat
```

## Install Agency Automation Tools

```
pip install --upgrade git+ssh://git@github.com/blitzagency/agency-automation-tools.git#egg=agency 
```

## Create Your First Project

```
devbot go
```

## Links

* [pip](http://www.pip-installer.org/en/latest/installing.html)
* [virtualenv](https://pypi.python.org/pypi/virtualenv)
* [virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/install.html )