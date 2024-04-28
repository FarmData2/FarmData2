# FarmData2

Welcome to FarmData2. FarmData2 aims to support the day-to-day operation of diversified vegetable farms while facilitating the record keeping necessary for organic certification and for the study of sustainable farming practices. For example, FarmData2 forms enable farm workers to efficiently and reliably enter data about common operations at the time they occur:

<table border=0>
  <tr>
    <td>
      <a href="docs/images/TraySeeding.jpg"><img src="docs/images/TraySeeding.jpg" alt="The Tray Seeding Form" width="200" /></a>
    </td>
    <td>
      <a href="docs/images/Transplanting.jpg"><img src="docs/images/Transplanting.jpg" alt="The Transplanting Form" width="200" /></a>
    </td>
    <td>
      <a href="docs/images/DirectSeeding.jpg"><img src="docs/images/DirectSeeding.jpg" alt="The Direct Seeding Form" width="200" /></a>
    </td>
  </tr>
</table>

FarmData2 is not ready for production use. Current efforts are moving FarmData2 toward supporting a full growing season including seeding (tray, direct, cover crop), transplanting, soil amendment and disturbance, and harvesting.

## Using FarmData2

FarmData2 is a plugin module for [farmOS](https://www.drupal.org/project/farm) and requires a running instance of farmOS (3.0 or later) and an internet connection.

If you are familiar with hosting docker and database-backed websites you can [host your own instance of farmOS](https://farmos.org/hosting/install/). You can then install the latest release of the [FarmData2 Drupal Module](https://www.drupal.org/project/farmdata2) into your farmOS instance.

For those preferring a managed approach [Farmier](https://farmier.com/) offers a subscription service where they create and host farmOS instances. FarmData2 hopes to be available on Farmier hosted instances of farmOS soon.

## Help and communications

The FarmData2 community communicates on the [FarmData2 Zulip Chat](https://farmdata2.zulipchat.com). Feel free to get in touch there with questions, comments, and suggestions.

Feature requests and bug reports related to the operation of FarmData2 can reported in the [FarmData2 Issue Tracker](https://github.com/FarmData2/FarmData2/issues) on GitHub or discussed in the [FarmData2 Zulip Chat](https://farmdata2.zulipchat.com).

## FarmData2 technologies

FarmData2 is a plugin module for [farmOS](https://farmos.org/).

The FarmData2 front-end is [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) with [Vue.js v3](https://vuejs.org/) and [BootstrapVueNext](https://bootstrap-vue-next.github.io/bootstrap-vue-next/). A working knowledge of [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) and [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) are also required for FarmData2 front-end development. FarmData2 accesses its data through the [farmOS.js library](https://github.com/farmOS/farmOS.js), which provides a JavaScript wrapper around the [farmOS API](https://farmos.org/development/api/).

FarmData2 uses several other tools and technologies. Is uses [GitHub flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for writing documentation and [JSDoc](https://jsdoc.app/) with [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown/wiki) for documenting library code and Vue.js components. It uses the [Cypress](https://www.cypress.io/) testing framework for unit testing, Vue Component Testing, and End-to-End Testing. [Bash scripts](https://www.gnu.org/software/bash/manual/bash.html) automate common tasks in FarmData2. A postgres database and the FarmData2 Development Environment run in [Docker containers](https://docs.docker.com/). Dependencies within the FarmData2 Development Environment are manages with [npm](https://docs.npmjs.com/). [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), [GitHub actions](https://docs.github.com/en/actions), and [Vite](https://vitejs.dev/guide/) automate testing, linting and building releases.

While, farmOS is a [Drupal](https://www.drupal.org/) application, little of the FarmData2 code requires any knowledge of Drupal.

The [Overview of the FarmData2 Codebase](docs/contributing/codebase.md) document provides further details.

## Contributing to FarmData2

If you are considering contributing to the development of FarmData2, the next step is to read the [Contributing Guide](CONTRIBUTING.md), which:

- describes some common ways to contribute to FarmData2.
- gives an [overview of the FarmData2 codebase](docs/contributing/codebase.md) including the tools, technologies and terminology that it uses.
- explains how to get started, including [how to install the FarmData2 Development Environment](INSTALL.md).
- outlines [the workflow that FarmData2 uses](CONTRIBUTING.md#the-farmdata2-workflow) for creating, reviewing and merging pull requests.

## Support for FarmData2

FarmData2 is thankful to the following organizations for their in-kind and financial support.

<!-- vale RedHat.Definitions = NO -->
<!-- Acronyms here seems acceptable -->

- [Dickinson College](https://www.dickinson.edu/)
- [farmOS](https://farmos.org/)
- [The GNOME Community Engagement Challenge](https://www.gnome.org/challenge/)
- [The National Science Foundation (DUE-2013069)](https://www.nsf.gov/awardsearch/showAward?AWD_ID=2013069)
- [The Non-Profit FOSS Institute](https://npfi.org/)
- [PASA Sustainable Agriculture](https://pasafarming.org/)
- [Zulip](https://zulip.com)

<!-- vale RedHat.Definitions = YES -->

## Licensing

<!-- vale write-good.Passive = NO -->
<!-- The phrasing of "are released under" is the common usage -->

![Creative Commons Attribution-ShareAlike 4.0 International License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png 'Creative Commons License') All textual materials in the FarmData2 project are released under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/)

![GPL V3 or Later](https://www.gnu.org/graphics/gplv3-or-later-sm.png 'GPL V3 or later') All code in the FarmData2 project is released under the [GNU General Public License Version 3 or later](https://www.gnu.org/licenses/gpl.txt).

<!-- vale write-good.Passive = YES -->

Complete information about the licenses and agreements that apply to the FarmData2 repository is in the [LICENSE.md](LICENSE.md) file.
