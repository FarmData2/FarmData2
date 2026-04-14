# FarmData2 Infrastructure Guide

<!-- vale Microsoft.Vocab = NO -->
<!-- "Sample" in "The Sample Database" is a valid use of "Sample" -->
<!-- and inline disabling did not work within a link -->

The infrastructure for FarmData2 includes the following main elements:

- [The Development Environment](#the-development-environment) - a collection of docker images/containers that run in GitHub Codespaces and provide an integrated development environment (IDE) and a running instance of farmOS.
- [The Sample Database](#the-sample-database)] - a database with a collection of example data for all features that can be used for manual and automated testing, and demonstration purposes.
- [Git Hooks](#git-hooks) - scripts that run on git actions such as checkout, commit and push to ensure that project style, correctness and versioning are properly maintained.
- [GitHub Actions](#github-actions) - workflow actions that run on GitHub to create releases when new fixes or features are pushed to the `development` or `production` branches.
- [Standard Tools](#standard-tools) - Common development tools that are used as part of FarmData2 development, for example `npm`, `vite`, and `cypress`.
- [Custom Scripts](#custom-scripts) - A collection of scripts used to manage aspects of FarmData2 development.

<!-- vale Microsoft.Vocab = YES -->

The overview of the organization of the FarmData2 codebase found in the [Introduction to the Codebase](../contributing/codebase.md) will also be helpful to review.

## The Development Environment

The FarmData2 Development Environment is a [Development Container](https://containers.dev/) that runs in GitHub Codespaces. When running this development container provides a Linux machine with a Visual Studio Code IDE, all the tools and extensions necessary for FarmData2 work, and a running instance of farmOS. The running instance of farmOS is provided by three _side car_ containers that are started when the development container is started:

- `fd2_farmos` - a Drupal instance that is running farmOS.
- `fd2_postgres` - the postgres database that Drupal uses to store its data.
- `fd2_nginx` - An Nginx reverse proxy server allowing farmOS to be accessed via https.

The structure of the Development Environment is described here, while instructions for starting the Development Environment in a codespace are given in [INSTALL.md](../../INSTALL.md).

- The `.devcontainer/devcontainer.json` file defines the contents of the FarmData2 Development Environment.
  - [`FarmData2/fd2dev`](https://hub.docker.com/r/farmdata2/fd2dev) is the base image for the development container and provides the features necessary for FarmData2 work. Full details of the `fd2dev` image can be found in the [FD2-Images](https://github.com/FarmData2/FD2-Images) repository. A few of the key features installed in the image include:
    - Docker-in-Docker to run the side car containers for the farmOS instance.
    - the `fluxbox` GUI desktop and a noVNC server to access it.
    - `node` and `npm` for managing FarmData2 dependencies.
    - the GitHub CLI.
    - some linting tools including vale, shellcheck and shfmt.
  - The `.devcontainer/postCreate.bash` script runs when a new codespace is created from the FarmData2 repository. This script performs the one-time configuration that is necessary to run and work on FarmData2. See the script for full details, but a few of the key actions it takes include:
    - creating a self-signed certificate for the Nginx reverse proxy and stores it in `docker/ssl`.
    - installing the FarmData2's npm dependencies.
    - setting up FarmData2's Git hooks.
    - building the FarmData2 modules.
    - generating the FarmData2 JSDoc documentation from source.
    - starting the side car containers defined in `docker/compose.yml`.
    - installing the <!-- vale Microsoft.Vocab = NO -->sample<!-- vale Microsoft.Vocab = YES --> database.
  - The `.devcontainer/postStart.bash` script is run each time the development container is started and:
    - adds routes to `/etc/hosts` for the side car containers.
    - starts the FarmData2 documentation server.
  - The `.devcontainer/postAttach,bash` script is run each time the Visual Studio Code client attaches to the development container. It performs the following actions:
    - installs a set of Visual Studio Code extensions that are used by FarmData2.
      - Note: This would normally be done in the `extensions` block of the `devcontainer.json` file. That seemed to create a race condition with the `npm ci` install of the dependencies. Also, the extensions are now installed here after the dependencies are installed. Further, the command to install the extensions must run in a Visual Studio Code terminal and the earlier lifecycle scripts do not.
    - checks that the necessary services are running and can be connected to. Specifically it checks that:
      - the docker engine can be accessed.
      - the PostgreSQL database can be accessed.
      - the farmOS instance can be accessed via the Nginx reverse proxy.
      - the FarmData2 documentation server can be accessed.
      - the fluxbox desktop can be accessed via the noVNC server.
  - The Development Environment exports three ports that can be opened from the "PORTS" tab in the Visual Studio Code IDE. These ports are:
    - `farmOS (443)` - The live instance of farmOS with the FarmData2 modules installed is running on this port.
    - `noVNC (6901)` - The noVNC server that will display the fluxbox GUI desktop for the development container is running on this port. This is used primarily to view and interact with the Cypress GUI test runner.
    - `docs (8082)` - The FarmData2 documentation server is running on this port.

<!-- vale Microsoft.Vocab = NO -->

## The Sample Database

The FarmData2 sample database is pre-loaded with a collection of data for all features that can be used for manual and automated testing, and demonstration purposes. Releases of the sample database are built from and stored in the [FD2-SampleDBs](https://github.com/FarmData2/FD2-SampleDBs) repository.

The `bin/installDB.bash` script is used to download and install a release of the sample database. By default, this script will:

1. Downloading the release to the `.fd2` directory.
2. Stopping the side car containers.
3. Decompresing the release into the `docker/db` directory which is mounted into the `fd2_postgres` sidecar container.
4. Restarting the sidecar containers.
5. Noting the version of the database that was installed in `.fd2dev/db.conf`.
   - This is used to ensure that the correct version of the database is used when switching between branches.

Full details on using the `installDB.bash` script can be found by running the script with the `--help` flag.

To add or edit the information in the sample database, see the instructions in the [FD2-SampleDBs](https://github.com/FarmData2/FD2-SampleDBs) repository.

## Git Hooks

The FarmData2 Development Environment installs Git hooks from the `.githooks` directory:

- `pre-commit` - prevents direct commits to the `development` or `production` branch, performs linting, and runs automated tests on code that is modified by the commit.
- `pre-push` - uses the `drupal-release` script to build a release on [git.drupalcode.org/farmdata2](https://git.drupalcode.org/project/farmdata2) when the `production` branch is pushed.
- `post-checkout` - checks the sample database version information in `.fd2dev/db.conf` and installs the version that matches the new branch if it differs from the previous branch.

<!-- vale Microsoft.Vocab = YES -->

## GitHub Actions

The `.github/workflows` directory contains the `release.yml` action that uses semantic versioning to build releases anytime new code is pushed to the `development` or `production` branches. When code is pushed to `development` a pre-release with a name such as `v1.2.3-development.4` is created. The `v1.2.3` indicates the next semantic release that would be created and the `.4` indicates the number of pre-releases that have been created for that version. When the push is to `production` a new semantic release is created, and all pre-releases except the most recent one are deleted. Also, a release will be created on [git.drupalcode.org/farmdata2](https://git.drupalcode.org/project/farmdata2) as described in the [Git Hooks](#git-hooks) section.

## Standard Tools

FarmData2 development uses a variety of standard development tools. Some of these tools include:

<!-- vale alex.ProfanityUnlikely = NO -->

- Visual Studio Code - the IDE provided by GitHub Codespaces. The IDE is used to edit all code, access the command line terminal, and interact with the CoPilot AI if used. A collection of Visual Studio Code extensions are installed by default when the Codespace is created. To change the extensions that are installed, edit the `extensions` block in `.devcontainer/devcontainer.json` and the `recommendations` block in `.vscode/extensions.json` file.
- Linting / Formatting - code and documentation are linted and formatted with a variety of common tools. These include `eslint`, `prettier`, `shellcheck`, `vale`, `shfmt`, `cspell`. This collection of tools can be used from the command line via `npm` scripts, within Visual Studio Code via extensions, and during the pre-commit git hook.
- `node` / `npm` - `npm` is used to manage the FarmData2 dependencies and to run scripts for some common tasks. The dependencies and the scripts can be found in `package.json`.
- Vite - is the build tool used to assemble the Vue single file components into the HTML/CSS/Javascript that implements them. Each module in `modules` (`farm_fd2`, `farm_fd2_examples`, `farm_fd2_school`) has its own Vite configuration files. The `vite.config.js` file is used for building the modules. The `vite.config.e2e.js` is used when running the end-to-end tests in Cypress.
- Cypress - is the testing framework that is used for all FarmData2 tests(end-to-end, component, unit). The `.cypress.module.config.js` file is used when running end-to-end tests, the `cypress.lib.config.js` is used when running unit tests, and `.cypress.comp.config.js` is used when running component tests.

<!-- vale alex.ProfanityUnlikely = YES -->

## Custom Scripts

The `bin` directory contains scripts that are used to automate common tasks in FarmData2. Each of the scripts is documented in more detail in other locations where the functionality it provides is discussed.
