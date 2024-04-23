# Running the FarmData2 Development Environment Locally

The FarmData2 Development Environment can be run locally on your machine. This approach will require that you install some dependencies on your machine.

## Install Help

If you run into problems during the install visit the dedicated [install stream](https://farmdata2.zulipchat.com/#narrow/stream/270906-install) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com). Use the search feature to see of others have had and hopefully solved the problem you are experiencing. If you don't find a solution, post a summary of your problem and the community will help.

## Dependencies

Running a FarmData2 Development Environment locally requires that you install the following dependencies:

1. [Docker Desktop](https://docs.docker.com/desktop/)
   - If you are using Windows be sure not to miss the step of [turning on the WSL 2 feature on Windows](https://learn.microsoft.com/en-us/windows/wsl/install).
1. git
   - Most systems now come with git pre-installed.
   - Open a terminal on your local machine (use a WSL terminal if on Windows) and used the following command:
     - `git --version`
   - If git is not installed, visit [git Downloads](https://git-scm.com/downloads) to install git.
     - For Windows, you will need to install the Linux version of git within WSL rather than the Windows version of git.

## Creating a FarmData2 Development Environment Locally

Use the following steps to create a FarmData2 Development Environment on your local machine:

1. Ensure that Docker Desktop is running.
1. Fork the [upstream FarmData2 repository](https://github.com/FarmData2/FarmData2) in GitHub.
1. Click the Green `Code" button and copy the HTTPS url for your fork. This URL should have your GitHub username in it.
1. In a terminal on your local machine (use a WSL terminal if on Windows):
   1. Clone your fork of the FarmData2 repository:
      - `git clone <URL>`
   1. Use `ls` to see the directory that was created for your clone of your fork of the FarmData2 repository.
   1. `cd` into your FarmData2 repository directory.
   1. Run the command:
      - `bin/fd2-up.bash`
      - When running on Windows (WSL) or Linux, this script must make some changes to your local machine configuration. To do so it will prompt you for your admin/root password. If you would like to see exactly what the script it doing before running it examine the source code in `bin/fd2-up.bash`.
1. When running `bin/fd2-up.bash` your terminal will display information about starting the FarmData2 Development Environment. This will take a few minutes.
1. Wait for the message "FarmData2 Development Environment started" to appear in your terminal.
1. Connect to the FarmData2 Development Environment using one of the following methods:
   - Connect using your web browser by visiting:
     - `http://localhost:6109`
       and then clicking the "Connect" button on the page that appears. See the [Connect Using Your Web Browser](connecting.md#connect-using-your-web-browser) section for additional information.
   - Connect to:
     - `localhost:5901`
       using a VNC client. See the [Connect Using a VNC Client](connecting.md#connect-using-a-vnc-client) section for additional information.
1. Follow the directions to [Setup the FarmData2 Development Environment](setup.md).

## Stopping a FarmData2 Development Environment Locally

To stop a running FarmData2 Development Environment on your local machine:

1. In a terminal on your local machine (use a WSL terminal if on Windows):
   1. `cd` into your FarmData2 repository directory.
   1. Run the command:
      - `bin/fd2-down.bash`

## Restarting a FarmData2 Development Environment Locally

After you have created a FarmData2 Development Environment on your local machine, it is much faster and easier to restart it.

1. Ensure that Docker Desktop is running.
1. In a terminal on your local machine (use a WSL terminal if on Windows):
   1. `cd` into your FarmData2 repository directory.
   1. Run the command:
      - `bin/fd2-up.bash`
1. Wait for the message "FarmData2 Development Environment started" to appear in your terminal.
1. [Connect to the FarmData2 Development Environment](connecting.md):
   - Using your web browser by visiting:
     - `http://localhost:6109`
   - Or using a VNC client and connecting to:
     - `localhost:5901`
1. When you are done working:
   1. Push the branch you are working on to your GitHub as a backup.
   1. [Stop the FarmData2 Development Environment](#stopping-a-farmdata2-development-environment-locally)
