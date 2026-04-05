# FarmData2 Infrastructure

The infrastructure for FarmData2 includes the following main elements:

In overview of the organization of the codebase can be found in the [Introduction to the Codebase](../contributing/codebase.md).

## The Development Environment

- The Devcontainer
- The Containers
  - FD2-Images
  - Self signed certificate

The FarmData2 Development Environment is a fully containerized dev container that is typically run in GitHub Codespaces.

.devcontainer directory

The development environment is made up of four docker images / containers:

- The devcontainer that is used to create the Codespace.
- The postgres database.
- Drupal and farmOS.
- Nginx reverse proxy for https.

These images are built from the [FD2-Images](https://github.com/FarmData2/FD2-Images) repository. See the documentation in that repository for information how to build new versions of the images.

## The Sample Databases

- FD2-SampleDBs

## Git Hooks

- pre-commit
- linting / testing
- pre-push
  - drupal release
- post-checkout
  - db version
  - .fd2dev directory and `db.conf` file.

## GitHub Actions

- Semantic release

## Standard Tools

- vite
  - `vite` configuration
- cypress
  - `cypress` configuration
- npm
  - `package.json`
- node
- Visual Studio Code
- Linting

## Custom Scripts

- `bin` - scripts used for building / testing / etc.
