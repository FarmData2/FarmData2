   <!-- vale RedHat.Definitions = NO -->
   <!-- The first use of WSL links to the docker install that explains it. -->

# Running the FarmData2 Development Environment Locally

The FarmData2 Development Environment can be run locally on your machine. This approach will require that you install some dependencies on your machine.

## Install Help

If you run into problems during the install visit the dedicated [install stream](https://farmdata2.zulipchat.com/#narrow/stream/270906-install) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com). Use the search feature to see of others have had and solved the problem you are experiencing. If you do not find a solution, post a summary of your problem and the community will help.

## Dependencies

Running a FarmData2 Development Environment locally requires that you install the following dependencies:

1. [Docker Desktop](https://docs.docker.com/desktop/)
   - If you are running Windows be sure not to miss the step of [turning on the WSL 2 feature on Windows](https://learn.microsoft.com/en-us/windows/wsl/install).
1. git
   - Most systems now come with git pre-installed.
   - Open a terminal on your local machine (use a WSL terminal if on Windows) and used the following command:
     - `git --version`
   - If git is not installed, visit [git Downloads](https://git-scm.com/downloads) to install git.
     - For Windows, you will need to install the Linux version of git within WSL rather than the Windows version of git.
1. [Tiger VNC Viewer](https://sourceforge.net/projects/tigervnc/files/stable/1.13.0/)
   - For Windows, download and run the `vncviewer64.1.13.0.exe` file.
   - For Mac, download and open the `TigerVNC.1.13.0.dmg` file and then copy the "TigerVNC Viewer" to your Applications folder.
   - Note: Newer versions of the Tiger VNC Viewer might work, but have not been tested.

## Creating a FarmData2 Development Environment Locally

Use the following steps to create a FarmData2 Development Environment on your local machine:

1. Check that Docker Desktop is running.
1. Fork the [upstream FarmData2 repository](https://github.com/FarmData2/FarmData2) in GitHub.
1. Click the <!-- vale RedHat.DoNotUseTerms = NO : green is associated with the "Code" button -->green<!-- vale RedHat.DoNotUseTerms = YES--> "Code" button and copy the HTTPS URL of your fork. This URL should have your GitHub username in it.
1. In a terminal on your local machine (use a WSL terminal if on Windows):
   1. Clone your fork of the FarmData2 repository:
      - `git clone <URL>`
   1. Use `ls` to see the directory that was created for your clone of your fork of the FarmData2 repository.
   1. `cd` into your FarmData2 repository directory.
   1. Run the command:
      - `bin/fd2-up.bash`
      - When running on Windows (WSL) or Linux, this script must make some changes to your WSL instance. To do so it will prompt you for your admin/root password. If you want to see what the script it doing before running it examine the source code in `bin/fd2-up.bash` and `bin/fd2-up.linux.bash`.
1. When running `bin/fd2-up.bash` your terminal will display information about starting the FarmData2 Development Environment. This will take 5-10 minutes depending upon your internet speed.
1. Wait for the message "FarmData2 Development Environment started" to appear in your terminal.
1. Launch the VNC Viewer and to connect to `localhost:5901`.
1. Follow the directions to [Setup the FarmData2 Development Environment](setup.md).
1. See the [Working in the FarmData2 Development Environment](working.md) document for more information about working in the FarmData2 Developer Environment.

## Stopping a FarmData2 Development Environment Locally

To stop a running FarmData2 Development Environment on your local machine:

1. In a terminal on your local machine (use a WSL terminal if on Windows):
   1. `cd` into your FarmData2 repository directory.
   1. Run the command:
      - `bin/fd2-down.bash`

## Restarting a FarmData2 Development Environment Locally

The FarmData2 Development Environment will restart much faster that the first time.

1. Check that Docker Desktop is running.
1. In a terminal on your local machine (use a WSL terminal if on Windows):
   1. `cd` into your FarmData2 repository directory.
   1. Run the command:
      - `bin/fd2-up.bash`
1. Wait for the message "FarmData2 Development Environment started" to appear in your terminal.
1. Connect to the FarmData2 Development Environment by using one of the following methods:
   - Use a web browser to visit `http://localhost:6109` and click the "Connect" button on the page that is displayed.
   - Use a VNC client to connect to`localhost:5901`.
1. When you are done working:
   1. Push the branch you are working on to your GitHub as a backup.
   1. [Stop the FarmData2 Development Environment](#stopping-a-farmdata2-development-environment-locally)

<!-- vale RedHat.Definitions = NO -->
