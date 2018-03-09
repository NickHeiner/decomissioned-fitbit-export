fitbit-export
[![Build Status](https://travis-ci.org/NickHeiner/fitbit-export.svg?branch=master)](https://travis-ci.org/NickHeiner/fitbit-export)
=============

A webapp to make exporting fitbit data easier. See the the app itself at http://fitbit-export.azurewebsites.net for more detail.

### Development
You must have the following env vars defined:

#### Values from dev.fibit.com
* `FITBIT_DATA_EXPORT_CLIENT_KEY`
* `FITBIT_DATA_EXPORT_CLIENT_SECRET`
* `FITBIT_DATA_EXPORT_DEV_CLIENT_KEY`
* `FITBIT_DATA_EXPORT_DEV_CLIENT_SECRET`

#### Any random string
* `FITBIT_DATA_EXPORT_SESSION_SECRET`
* `FITBIT_DATA_EXPORT_DEV_SESSION_SECRET`

### Deployment
This site is deployed to Microsoft Azure. Be aware of [the node_modules issue](http://stackoverflow.com/questions/37090522/force-node-modules-to-be-reinstalled) when deploying, since that
can create inconsistency between local and deployed development.


## v2
I'm redoing this with a new approach.

### Development
The sensitive terraform files are encrypted with git-crypt, and I have the only key to unlock them. If you want to run your own instance of this project, you'll need to delete those `.tfstate` files, point Terraform to your own AWS account, and recreate the state.
