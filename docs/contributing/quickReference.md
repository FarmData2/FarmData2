# FarmData2 Development Environment Quick Reference

## farmOS Credentials

| User                   | Password    | Notes                                         |
| ---------------------- | ----------- | --------------------------------------------- |
| `manager1` (or `2`)    | `farmdata2` | A farmOS user with manager privileges.        |
| `worker1` (or `2`-`5`) | `farmdata2` | A farmOS user with worker privileges.         |
| `guest`                | `farmdata2` | A farmOS user with guest privileges.          |
| `admin`                | `admin`     | The Drupal/farmOS user with admin privileges. |

## Keyboard Shortcuts

### Visual Studio Code IDE

| Windows/Linux          | MacOS                | Action                     |
| ---------------------- | -------------------- | -------------------------- |
| `Ctrl + c`             | &#8984;`+ c`         | Copy                       |
| `Ctrl + v`             | &#8984;`+ v`         | Paste                      |
| `Ctrl + s`             | &#8984;`+ s`         | Save                       |
| `Ctrl + Z`             | &#8984;`+ z`         | Undo                       |
| `Ctrl + Y`             | &#8984;`+ Shift + Z` | Redo                       |
| `Ctrl + f`             | &#8984;`+ f`         | Find                       |
| `` Shift + Ctrl + ` `` | &#8984;`+ Shift + C` | Open a new terminal        |
| `Shift + Alt + F`      | `Shift + Option + F` | Auto format text/code      |
| `Alt + z`              | `Alt + z`            | Toggle word wrap in editor |
| `Ctrl + /`             | &#8984;`+ /`         | Toggle comment             |
| `Ctrl + b`             | &#8984;`+ b`         | Toggle EXPLORER side bar   |

### Browser

| Windows/Linux           | MacOS                     | Action                     |
| ----------------------- | ------------------------- | -------------------------- |
| `F12`                   | `F12`                     | Toggle the Developer Tools |
| `Ctrl + Shift + Delete` | &#8984;`+ Shift + Delete` | Clear browsing history.    |

## FarmData2 Commands

### Test Commands

| Command                                                    | Action                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `test.bash --comp`                                         | Run the component tests.                                         |
| `test.bash --lib --unit`                                   | Run the library tests.                                           |
| `test.bash --e2e --fd2 --live`                             | Run the `farm_fd2` module's e2e tests.                           |
| `test.bash --fd2 --unit`                                   | Run the `farm_fd2` module's unit tests.                          |
|                                                            |                                                                  |
| `test.bash --comp --gui`                                   | Append `--gui` to any command to run in Cypress GUI test runner. |
| `test.bash --comp --glob=**/LocationSelector/*.comp.cy.js` | Use `--glob` with any command to specify specific tests to run.  |
|                                                            |                                                                  |
| `test.bash --help`                                         | See all options.                                                 |

<!-- vale Microsoft.Vocab = NO --> <!-- Sample Database is correct. -->

### (Re)Installing the Sample Database

| Command                    | Action                                                                   |
| -------------------------- | ------------------------------------------------------------------------ |
| `installDB.bash`           | Install the version of the sample database for the current branch.       |
| `installDB.bash --prompt`  | Prompt the user to select the version of the sample database to install. |
| `installDB.bash --current` | Reinstall the sample database from the `tar.gz` file in `./fd2/`         |
| `installDB.bash --help`    | See all options, including for how to install development releases.      |

<!-- vale Microsoft.Vocab = YES -->

### Building FarmData2 Modules

| Command                  | Action                                                              |
| ------------------------ | ------------------------------------------------------------------- |
| `npm run build:fd2`      | Rebuild the `farm_fd2` module.                                      |
| `npm run watch:fd2`      | Watch the `farm_fd2` module and rebuild when files change.          |
| `npm run build:examples` | Rebuild the `farm_fd2_examples` module.                             |
| `npm run watch:examples` | Watch the `farm_fd2_examples` module and rebuild when files change. |
| `npm run build:school`   | Rebuild the `farm_fd2_school` module.                               |
| `npm run watch:school`   | Watch the `farm_fd2_school` module and rebuild when files change.   |

### (Re)Building the Documentation

| Command            | Action                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| `npm run docs:gen` | Rebuild the component and library documentation from the source files. |

### Viewing farmOS JSON Schema

| Command                       | Action                                               |
| ----------------------------- | ---------------------------------------------------- |
| `npm run printlog`            | List the JSON structures in the farmOS schema.       |
| `npm run printlog <log_type>` | Print the JSON structure used for `<log_type>` logs. |
| `npm run printlog all`        | Print all JSON structures in the farmOS schema.      |

### Working with Pull Requests

| Command                    | Action                                                        |
| -------------------------- | ------------------------------------------------------------- |
| `fetchPR.bash <PR Number>` | Fetch the compare branch for pull request number <PR number>. |
| `pushPR.bash <PR Number>`  | Push a fetched PR to upstream (requires write permission.     |

## Git Commands

| Command                         | Action                                                      |
| ------------------------------- | ----------------------------------------------------------- |
| `cd ~/FarmData2`                | Change to the root directory of the FarmData2 repository.   |
| `git status`                    | Display the current branch, modified, and staged files.     |
| `git switch development`        | Switch to the `development` branch.                         |
| `git pull upstream development` | Synchronize with the upstream `development` branch.         |
| `git branch <branch_name>`      | Create a new branch named `<branch_name>`.                  |
| `git switch <branch_name>`      | Switch to the branch named `<branch_name>`.                 |
| `git push origin <branch_name>` | Push the branch named `<branch_name>` to your GitHub space. |


## Linux CLI Commands
| Command                    | Action                                                        |
| -------------------------- | ------------------------------------------------------------- |
| `pwd`
| `ls`
| `cd <path>`

## Workflow

[Coauthors Generator](https://coauthors.me/generator)
