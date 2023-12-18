# Install

TODO:NEEDS TO BE REVISED, EXPANDED AND CLEANED UP

## Prerequisites

- Docker Desktop

  - In Docker Desktop -> Settings -> Advanced

    - Enable: Allow the default Docker socket to be used
    - if it exists... depends on version.

  - Tiger VNC Viewer

## Installation of Dev Env

- Clone repo
- cd FarmData2/bin
- ./fd2-up.bash
  - Wait for Message: `FarmData2 development environment started`
    - Spinner
    - Will take a little time the first time.
- Open TigerVNC
- Connect to `localhost:5901`
- open terminal
  - Logged in as `fd2dev` with password `fd2dev`
  - have sudo privileges
- cd FarmData2
- npm install
  - may need to install cypress???
- symlink .githooks into .git as hooks
- Configure git:
  - git config --global user.email "you@example.com"
  - git config --global user.name "Your Name"
- Open Codium
  - Open FarmData2 folder
  - Check "Trust the authors of all files in the parent folder fd2dev"
  - Click "Yes, I trust the authors"
- Create GH PAT
  - Permissions of 'repo', 'read:org', 'workflow'
  - copy PAT somewhere safe
- Log into gh
  - gh auth login --hostname GitHub.com --git-protocol https
  - use PAT as password.
- Run builds (NEED TO CHECK - dist Dirs will not exist first time around???)

  - Maybe fd2-up.bash should create them???
  - npm run build:fd2
  - npm run build:examples
  - npm run build:school

- Install sample Database

  - installDB.bash - installs the most recent release of the sample database.

- Test farmOS

  - Visit `http://farmos` and login.

  Credentials:

  - Login:
    - User: admin
    - Pass: admin
  - Login:
    - User: manager1 (or 2)
    - Pass: farmdata2
  - Login:
    - User: worker1 (or 2, 3, 4, 5)
    - Pass: farmdata2
  - Login:
    - User: guest
    - Pass: farmdata2
