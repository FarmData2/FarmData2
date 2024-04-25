# FarmData2 Development Environment Credentials

The FarmData2 Development Environment has two types of credentials:

- The [Linux Credentials](#linux-credentials) apply to the user within the FarmData2 Development Environment.
- The [farmOS Credentials](#farmos-credentials) apply to logging into the farmOS instance that is running in the FarmData2 Development Environment.

## Linux Credentials

When connecting to the FarmData2 Development Environment you will be automatically Logged into the Linux system with the following credentials:

- User: `fd2dev`
- Pass: `fd2dev`

The `fd2dev` user belongs to the following groups::

- `fd2docker` - allowing it to run docker commands using the host's docker daemon.
- `fd2dev` - allowing it to modify files mounted from the host.
- `sudo` - allowing it to run commands as root.

## farmOS Credentials

You can log into the farmOS instance running in the FarmData2 Development Environment by connecting the browser to:

- [http://farmos](http://farmos)

and using any of the following credentials:

- The Drupal Admin User:
  - User: `admin`
  - Pass: `admin`
- A farmOS Farm Manager:
  - User: `manager1` (or `2`)
  - Pass: `farmdata2`
- A farmOS Farm Worker:
  - User: `worker1` (or `2`, `3`, `4`, `5`)
  - Pass: `farmdata2`
- A farmOS Guest:
  - User: `guest`
  - Pass: `farmdata2`

The farmOS users correspond to the [default managed roles defined by the farmOS application](https://farmos.org/guide/people/).
