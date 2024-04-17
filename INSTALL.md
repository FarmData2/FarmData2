# Install

FarmData2 provides a fully containerized Linux-based development environment for working on the FarmData2 project. Using this FarmData2 Development Environment ensures that you have the correct versions of all of the tools, libraries and other dependencies needed to do  FarmData2 development.

There are multiple ways to install the FarmData2 Development Environment.

- [Running the FarmData2 Development Environment in GitPod](#running-the-farmdata2-development-environment-in-gitpod) - The quickest and easiest way to get started.  This install runs entirely in the cloud, but it has a limit of 50 horus that it can be used for free each month. 
- [Running the FarmData2 Development Environment Locally](#running-the-farmdata2-development-environment-locally) - A little more work to install, but it runs off-line and has no time limits.  Because this install runs entirely on your local machine, it requires sufficient resources (~16GB RAM and 8 CPU cores) to run efficiently.
- [Local Install of the FarmData2 Development Tools](#local-install-of-the-farmdata2-development-tools) - You can also attempt to install all of the necessary development tools, libraries and other dependencies on your local machine and not work within the Linux-based FarmData2 Development Environment. While possible in theory, this approach is not fully supported at this time.

## Running the FarmData2 Development Environment in GitPod

### One Time Setup

The following steps will only need to be completed once.

1. Sign up for a free [GitPod account](https://gitpod.io/login/).
  - Use your GitHub credentials to log in.
  - The free account provides 50 hours/week of usage. Additional hours of usage can be purchased at a reasonable rate.
    - Or if you prefer you can move to a [Local Launch of the Development Environment](#local-launch-of-development-environment) as described below.
1. Fork the [upstream FarmData2 repository](https://github.com/FarmData2/FarmData2).
1. Copy the URL of your fork.  This URL should have your GitHub username in it.
1. Visit: https://gitpod.io/new
   1. Paste the URL of your FarmData2 fork into the "Select a repository" search box and click the search result.
   1. Choose the "Terminal" as your Editor in the second dropdown list.
   1. Choose "Standard" as the machine configuration in the third dropdown list.
1. Click "Continue".
1. Enter the following command in the terminal that appears:
   - `gp stop`
1. Visit https://gitpod.io/workspaces/
   - You should see your "farmdata2" workspace here.
1. Click the _three vertical dots_ to the right.
1. Select "Pin" - this will ensure that your workspace is not automatically deleted after a period of inactivity.

### Opening the GitPod Workspace

The following steps can be used to "Open" the workspace each time you would like to work.

1. Visit https://gitpod.io/workspaces/
   - You should see your "farmdata2" workspace here.
1. Click the _three vertical dots_ to the right.
1. Select "Open"
1. A terminal window will open in your browser.
   1. Notice that you are in a directory named `/workspace/FarmData2`. This is because GitPod automatically clones your fork of FarmData2 the first time that it opens your workspace.  You can use `ls` to confirm that this directory contains all of the FarmData2 files.
   1. Use the command:
      - `bin/fd2-up.bash`
        - The first time you open the workspace you will be prompted to enter this command three times. After that, you will only need to enter it once.
        - This command will take some time (~5-10 minutes) to complete the first time that you open the workspace.  After that, the workspace will open much more quickly.
1. 



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


__ALL OF THE FOLLOWING IS DONE BY The startup SCRIPT__
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
