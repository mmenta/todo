Tooling Getting Started Guide (windows 8.1)
=============================================

Install 7-Zip
---------------
1. Download and install 7-Zip from 7-zip.org. If you do not want to use 7-Zip as a command line tool, skip the next steps.
2. Add the directory you installed 7-Zip into to your path (Start -> Control Panel -> System -> Advanced -> Environment Variables).


Install Python
---------------

Install Activestate Python community edition 
>[http://www.activestate.com/activepython/downloads](http://www.activestate.com/activepython/downloads)

Use this crazy pip-Win installer for getting pip working (activestate won't include it by default)
>[https://sites.google.com/site/pydatalog/python/pip-for-windows](https://sites.google.com/site/pydatalog/python/pip-for-windows)

TODO: PyCrypto install instructions if needed

Install Git
---------------

Install Git 
>[http://git-scm.com/download/win](http://git-scm.com/download/win)

I use the setting to install git to the cmd line as well as gitbash 
I also tell it to leave the line endings alone completely

Install Console2
---------------------

Install console2 for safety's sake 
>[http://sourceforge.net/projects/console/](http://sourceforge.net/projects/console/)

Config gitbash as the default console in console 2 (if you put the console directory in program files, you have to save settings in the user directory).

	Title: GIT
	Icon: C:\Program Files (x86)\Git\etc\git.ico
	Shell: "C:\Program Files (x86)\Git\bin\sh.exe" --login -i 
	Startup Dir: I use ~/Projects

While you're at it change the copy and paste commands to ctrl-C and ctrl-v for your own sanity

Run as Admin
---------------

Whichever console you use it will need to run with administrative privileges. If other applications (like Virtualbox) are having issues try running them as admin as well.

Install Virtualbox
----------------------
>[https://virtualbox.org/wiki/Downloads](https://virtualbox.org/wiki/Downloads)

Install Vagrant
>[http://downloads.vagrantup.com/](http://downloads.vagrantup.com/)

Github configuration
-------------------
Create an ssh key using ssh-keygen.exe and add it to your account on github

	
Install Agency Automation Tools
-----------------------
Now install the agency tools from your home directory (it seems to like this)

	pip install git+ssh://git@github.com/blitzagency/agency-automation-tools.git#egg=agency