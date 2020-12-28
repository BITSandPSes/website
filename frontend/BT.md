There is a severe BT whenever one tries to setup dev build for the project.
This is the guide on how to get through it.
This error arises due to conflicting babel versions on backend and frontend jsons, which prevent the project from compiling

##Step 1
Create a config folder in root directory. Add a dev.env file into it and paste the following content:

SKIP_PREFLIGHT_CHECK=true

##Step 2

in the package.json file in frontend folder, add a proxy to server
"proxy": "http://localhost:8080"

##Step 3

in the command line in frontend folder run the command

yarn add env-cmd

##Step 4
in the package.json file in frontend folder, prefix whatever is in the start script by 

env-cmd -f ../config/dev.env

##Step 5
open two seperate command windows. 
In the first, write the command under root directory

yarn run dev

After this, in the second window under frontend folder, boot up the lite server

yarn start


and we are done !!!