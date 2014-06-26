# Marionette HTML Application Foundation

## Features

* Compass
* Saas
* RequireJS
* Marionette
* Backbone
* Handlebars
* Underscore
* Jasmine
* Jasmine jQuery
* Karma

## Requirements

* [Node.js](http://nodejs.org/download/)
* RequireJS
* Compass

Download and install Node.js then run the following.

```
gem install compass sass
sudo npm install -g requirejs

```

## Testing Requirements:

* Karma
* Jasmine
* RequireJS
* Jasmine-jQuery

### To install testing dependencies:

You must have installed node.js and npm for this to work, see above.
Run this from your shell:

```
make install-test-reqs
```

To continuously run your tests:

```
./node_modules/karma/bin/karma start
```

That's horrible, so lets simplify that:

```
make install-test-cli
```

Now to run your tests, from the root of your project run:

```
karma start
```

**NOTE** you will only need to `make install-test-cli` once, no matter the
project. It will install the karma shortcut globally on your system.
If you already have the karam cli tool installed, running this command
may simply generate an error. Nothing will break.



## Quick Start Commands

To get started you'll only need to run `make serve` and `make watch`.


```
# start a dev server
make serve

# run compass watch
make watch

# build project
make all
```


## Want docs? ok... ##
``` bash
npm install
pip install sphinx sphinx_rtd_theme
make doc
make serve-doc
```
[view local docs](http://localhost:8000/)