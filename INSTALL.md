# Install

TODO:NEEDS TO BE REVISED, EXPANDED AND CLEANED UP

## Prerequisites

- [Install WSL2 if on Windows](https://learn.microsoft.com/en-us/windows/wsl/install)
- Install [Docker Desktop](https://docs.docker.com/desktop/)
  - In Docker Desktop -> Settings -> Advanced
    - Enable: Allow the default Docker socket to be used
    - if it exists... depends on version.
- Install [Tiger VNC Viewer](https://sourceforge.net/projects/tigervnc/files/stable/1.13.0/)

## Installation of Dev Env

- Open terminal (WSL terminal if on windows)
- Clone repo
- `cd FarmData2/bin`
- `./fd2-up.bash`
  - May be prompted for admin password
  - Wait for the message: `FarmData2 development environment started`
    - This will take a little while (~5 minutes) the first time.
- Open TigerVNC
- Connect to `localhost:5901`
  - You will be automatically Logged in as user `fd2dev` with password `fd2dev`
  - You will have sudo privileges
- Open a terminal from dock at bottom of window.
- `cd FarmData2`
- `npm install`
- Symlink .githooks into .git as hooks
  - `mv .git/hooks .git/hooks.orig`
  - `ln -s .githooks .git/hooks`
- Configure git:
  - `git config --global user.email "you@example.com"`
  - `git config --global user.name "Your Name"`
- Open Codium from the dock at the bottom of the window.
  - Open `FarmData2` folder
  - Check "Trust the authors of all files in the parent folder fd2dev"
  - Click "Yes, I trust the authors"
- Create a [GH Personal Access Token (PAT)](https://docs.github.com/en/enterprise-server@3.9/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
  - Must have permissions of 'repo:all', 'read:org', 'workflow'
  - Copy your PAT somewhere safe
- Log into the `gh` CLI tool
  - `gh auth login --hostname GitHub.com --git-protocol https`
  - paste your PAT as password.
- Run builds
  - `npm run build:fd2`
  - `npm run build:examples`
  - `npm run build:school`
- Install the sample Database
  - `installDB.bash`
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
