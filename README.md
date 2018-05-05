# check-exeter-login
A nodejs script to check a student's Exeter login.

This script is run as follows (though it is intended to be modified for integration into apps):
```shell
node check-exeter-login.js exeterUsername exeterPassword
```
It will print "Successful login" or "Unsuccessful login" depending on whether the credentials are valid (if no error occurs).

This is designed to work with the connect.exeter.edu API as of May 2018.

~ George Matheos
