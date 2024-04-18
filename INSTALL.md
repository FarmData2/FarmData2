# Install

FarmData2 provides a fully containerized Linux-based development environment for working on the FarmData2 project. Using this FarmData2 Development Environment ensures that you have the correct versions of all of the tools, libraries and other dependencies needed to do FarmData2 development.

There are multiple ways to install the FarmData2 Development Environment.

- [Running the FarmData2 Development Environment in GitPod](#running-the-farmdata2-development-environment-in-gitpod) - The quickest and easiest way to get started. This install runs entirely in the cloud, but it has a limit of 50 horus that it can be used for free each month.
- [Running the FarmData2 Development Environment Locally](#running-the-farmdata2-development-environment-locally) - A little more work to install, but it runs off-line and has no time limits. Because this install runs entirely on your local machine, it requires sufficient resources (~16GB RAM and 8 CPU cores) to run efficiently.
- [Local Install of the FarmData2 Development Tools](#local-install-of-the-farmdata2-development-tools) - You can also attempt to install all of the necessary development tools, libraries and other dependencies on your local machine and not work within the Linux-based FarmData2 Development Environment. While possible in theory, this approach is not fully supported at this time.

## Running the FarmData2 Development Environment in GitPod

### The First Run

The first time you run the FarmData2 Development Environment in GitPod you will need to use the following steps. Subsequent runs will be much faster and simpler.

1. Sign up for a free [GitPod account](https://gitpod.io/login/).

- Use your GitHub credentials to log in.
- The free account provides 50 hours/week of usage. Additional hours of usage can be purchased at a reasonable rate.
  - Or if you prefer you can [run the FarmData2 Development Environment locally](#running-the-farmdata2-development-environment-locally) as described below.

1. Visit the [GitPod Preferences](https://gitpod.io/user/preferences) page.
   1. Under "New Workspaces", set the "default editor" to be "Terminal".
   1. Under "Timeouts", set the "Default Workspace Timeout" to be 10m. This may require you to restart the workspace if you walk away for a bit, but it will prevent you from accidentally wasting your free monthly hours.
1. Fork the [upstream FarmData2 repository](https://github.com/FarmData2/FarmData2).
1. Copy the URL of your fork. This URL should have your GitHub username in it.
1. Visit [the new GitPod workspace page](https://gitpod.io/new) and paste the URL of your FarmData2 fork into the "Select a repository" search box and click the search result.
1. Click "Continue".
1. Enter the following command in the terminal that appears:
   - `gp stop`
1. Visit [your GitPod workspaces](https://gitpod.io/workspaces/)
   - You should see your "farmdata2" workspace here.
1. Click the _three vertical dots_ to the right.
1. Select "Pin" - this will ensure that your workspace is not automatically deleted after a period of inactivity.
1. Click the _three vertical dots_ to the right again.
1. Select "Open"
1. A terminal window will open in your browser.
   1. Notice that you are in a directory named `/workspace/FarmData2`. This is because GitPod automatically clones your fork of FarmData2 the first time that it opens your workspace. You can use `ls` to confirm that this directory contains all of the FarmData2 files.
   1. Use the command:
      - `bin/fd2-up.bash`
        - You will be prompted to enter this command two more times.
        - After the final time you enter the command it will take some time (~5 minutes) to complete.
        - A red error message indicating that a "Name or service not know" will appear. This can be safely ignored at this time.
1. When the `bin/fd2-up.bash` command completes you will see information about how to connect to the FarmData2 Development Environment.

#### Connecting Within Your Browser

To connect within your browser just click the provided link and then the "Connect" button that appears in your browser.

There are a few things to know about running the FarmData2 Development Environment in the browser.

- There is a "noVNC Menu" that can be opened at the left edge of the desktop.
  - Use the _gear_ icon and set the "Scaling Mode" to "Remote Resizing" to have the desktop automatically fill the browser window.
  - Use the _full screen_ icon to change the desktop into full screen mode.
  - Use the _clipboard_ icon to copy and paste information between the FarmData2 Development Environment and your local machine. If copying between your local machine and the FarmData2 Development Environment is something you do frequently you may want to consider [using a VNC Client](#connecting-using-a-vnc-client), which does not have this limitation.

#### Connecting Using a VNC Client

You can use the directions provided to connect to the FarmData2 Development Environment using a VNC Client such as the [Tiger VNC Viewer](https://sourceforge.net/projects/tigervnc/files/stable/1.13.0/)

The main advantage of using a VNC client is that you can copy and paste between your host machine and the FarmData2 Development Environment more easily.

### Restarting a Workspace

After you have created a workspace the first time, it is much faster and easier to restart it.

1. Visit [your GitPod workspaces](https://gitpod.io/workspaces).
1. Click the _three vertical dots_ to the right of your "farmdata2" workspace".
1. Select "Open"
1. Enter the command `bin/fd2-up.bash`
1. Follow the instructions to connect to the FarmData2 Development Environment in the browser or using a VNC client.

## Running the FarmData2 Development Environment Locally

### Prerequisites

- [Install WSL2 if on Windows](https://learn.microsoft.com/en-us/windows/wsl/install)
- Install [Docker Desktop](https://docs.docker.com/desktop/)
  - In Docker Desktop -> Settings -> Advanced
    - Enable: Allow the default Docker socket to be used
    - if it exists... depends on version.
- Install [Tiger VNC Viewer](https://sourceforge.net/projects/tigervnc/files/stable/1.13.0/)

### Installation of Dev Env

- Open terminal (WSL terminal if on windows)
- Clone repo
- `cd FarmData2/bin`
- `./fd2-up.bash`
  - May be prompted for admin password
    - The first time there may be a few red error messages.
  - Wait for the message: `FarmData2 development environment started`
    - This will take a little while (~5 minutes) the first time.
- Open TigerVNC
- Connect to `localhost:5901`

  - You will be automatically Logged in as user `fd2dev` with password `fd2dev`
  - You will have sudo privileges

- Open a terminal from dock at bottom of window.
  - `setup.bash`
- Open Codium from the dock at the bottom of the window.

  - Open `FarmData2` folder
  - Check "Trust the authors of all files in the parent folder fd2dev"
  - Click "Yes, I trust the authors"

- Test farmOS
  - Visit `http://farmos` and login.
  - Credentials
  - Admin User:
    - User: admin
    - Pass: admin
  - Farm Manager:
    - User: manager1 (or 2)
    - Pass: farmdata2
  - Farm Worker:
    - User: worker1 (or 2, 3, 4, 5)
    - Pass: farmdata2
  - Guest:
    - User: guest
    - Pass: farmdata2

## Local Install of the FarmData2 Development Tools

This is a much more labor intensive process and you may encounter significant difficulties that are dependent upon the versions of software installed on your local machine.

### Dependencies

This should be sketched out...

**ALL OF THE FOLLOWING IS DONE BY The startup SCRIPT**

- Open a terminal from dock at bottom of window.
- `cd FarmData2`
- `npm install`
- Symlink .githooks into .git as hooks
  - `rm -rf .git/hooks`
  - `ln -s .githooks .git/hooks`
- Configure git:

  - `git config --global user.email "you@example.com"`
  - `git config --global user.name "Your Name"`

- Create a [GH Personal Access Token (PAT)](https://docs.github.com/en/enterprise-server@3.9/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)

  - Must have permissions of 'repo:all', 'read:org', 'workflow'
  - Copy your PAT somewhere safe

- Log into the `gh` CLI tool
  - `gh auth login --hostname GitHub.com --git-protocol https`
  - can use the browser... or
  - paste your PAT as password.
- Run builds
  - `npm run build:fd2`
  - `npm run build:examples`
  - `npm run build:school`
  - These generate errors because it tries to clear drupal cache...
- Install the sample Database
  - `installDB.bash`
