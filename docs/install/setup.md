# Setting up the FarmData2 Development Environment

When the FarmData2 Development Environment is created for the first time it requires some additional setup. Use the following steps to perform this setup.

Within the FarmData2 Development Environment:

1. Open a terminal from the dock at the bottom of the window.
1. Use the `ls` command and notice that there is a directory with the same name as your fork of FarmData2. This directory is a clone of your fork of FarmData2that GitPod made when you created the workspace.
1. `cd` into this directory.
1. Run the following command: `setup.bash`
   - This script will install all of the dependencies, configure the FarmData2 Development Environment for use and build the FarmData2 project. Note that in doing so, the script will prompt you for information and will ask you to authenticate with GitHub. If you would like to know exactly what the script is doing you can examine the source code in `bin/setup.bash`.
1. Open the Firefox web browser from the dock at the bottom of the Linux desktop.
1. Visit the URL:
   - [`http://farmos`](http://farmos)
1. You will see an "Access Denied" message.
1. Log into FarmOS using the credentials:
   - Username: `manager1`
   - Password: `farmdata2`
1. Ensure that the _FarmData2_, _FD2 Examples_ and _FD2 School_ menu options appear in the farmOS menu.
   - Depending on the size of the Firefox window the farmOS menu may appear on the left, or you may need to click the "hamburger" icon (&#9776;) in the top left corner of the window to display it.
1. Open the VSCodium IDE from the dock at the bottom of the Linux desktop.
   1. Open your FarmData2 folder
   1. Check "Trust the authors of all files in the parent folder fd2dev"
   1. Click "Yes, I trust the authors"
