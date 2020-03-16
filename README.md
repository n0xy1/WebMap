"# WebMap" 


SETUP:
-Symlink the rsrState.json file to ./webmap/link/rsrState.json

e.g. run this command: mklink "webmap/link/rsrState.json" "C:\Users\Administrator\Saved Games\DCS.openbeta_server\Scripts\RSR\rsrState.json"


RUNNING:
webmap.exe -p <port>

If no port is specified, it will run on port 8080.

STOPPING:
Just close the window ;)