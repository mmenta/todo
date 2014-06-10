# Contributing

## Getting Started

### Requirements

Assumes you have created an enviroment called `aat` and installed the following:

* virtualenv
* virtualenvwrapper

For more information see `./docs/nix-getting-started.md`

### Setup 

```
workon aat
git clone git@github.com:blitzagency/agency-automation-tools.git
cd agency-automation-tools
python setup.py develop
```

### Create Working Directories

1. Run `devbot go`
2. Enter project name.
3. Select profile you would like to work on.
4. Cancel operation using `[Ctrl]-C`

This will clone the needed repos and add them to `~/.agency/`. You can now edit the repos directly in these folders without having to commit to test.
