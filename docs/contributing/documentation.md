# Documentation Guide

The FarmData2 documentation is written in a combination of [GitHub flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) and [JSDoc](https://jsdoc.app/).

## Outline

- [Viewing Documentation](#viewing-documentation)
- [Writing Documentation](#writing-documentation)
- [Pre-commit Checks for Documentation](#pre-commit-checks-for-documentation)
  - [Markdown Link Check](#markdown-link-check)
    - [Turning off Markdown Link Check for a Link](#turning-off-markdown-link-check-for-a-link)
  - [ESLint Markdown](#eslint-markdown)
    - [Turning off ESLint Markdown for a Line](#turning-off-eslint-markdown-for-a-line)
    - [Configuring the ESLint Markdown Style Guide](#configuring-the-eslint-markdown-style-guide)
  - [Vale](#vale)
    - [Turning Off a Vale Rule for a Block of Text](#turning-off-a-vale-rule-for-a-block-of-text)
    - [Turning Off a Vale Rule within a Block of Text](#turning-off-a-vale-rule-within-a-block-of-text)
    - [Vale Configuration](#vale-configuration)

## Viewing Documentation

Use the following command to view the FarmData2 documentation:

```bash
npm run docs:view
```

This command will open a browser tab containing an index to the FarmData2 documentation.

## Writing Documentation

The main documentation files (`README.md`, `CODE_OF_CONDUCT.md`, `LICENSE.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`) are contained in the project root directory. All other documentation for the project is contained in the `docs` directory.

Documentation contained in the `docs/components` and the `docs/library` sub-directories documents code details. This documentation is automatically generated from the source code. The details of how that documentation is written and generated are contained in the appropriate contribution guides:

- [Components Guide](components.md)
- [Library Guide](libraries.md)

## Pre-commit Checks for Documentation

All markdown (`.md`) files staged for a commit must pass checks by [markdown-link-check](https://github.com/tcort/markdown-link-check), [eslint-plugin-md](https://github.com/leo-buneev/eslint-plugin-md), and[Vale](https://vale.sh/).

### Markdown Link Check

Markdown link check visits each link in the files to check that the link is valid (Status Code 200). If any link is not valid then the check will fail and the commit will be canceled.

#### Turning off Markdown Link Check for a Link

To prevent markdown link check from checking a specific link, add it to the `.markdown-link-check.json` file.

### ESlint Markdown

ESLint checks the files for compliance with the [Markdown Style Guide](https://cirosantilli.com/markdown-style-guide/) with the [`eslint-plugin-md`](https://github.com/leo-buneev/eslint-plugin-md).

#### Turning off ESLint Markdown for a Line

ESLint can be turned off for a line in the `.md` file by placing a comment on the line before the error. ESLint is automatically turned back on for following lines.

```html
<!-- eslint ignore - give an explanation -->

ESLint is disabled for this line ESLint is re-enabled for this line and all
following lines.
```

#### Configuring the ESLint Markdown Style Guide

Individual rules in the ESLint markdown style guide can be adjusted or turned off in the `.eslintrc.cjs` file. A full list of the rules can be found in the [remark-preset-lint-markdown-style-guide](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide). More details on the configuration of ESLint for markdown can be found in [Sergio Cinos' ESLint for Markdown Guide](https://scinos.dev/posts/2020-11-24-eslint-for-markdown/).

### Vale

Vale is a _prose linter_ that checks the text of the files by using a set of style guides. The style guides contain rules for things such as sentence length, basic grammar, comma usage, non-inclusive language, and more. Most of the rules are helpful, but at times you will inevitably find yourself having to reword around some of them. While this is frustrating, on balance it leads to more consistent and readable documentation. The most annoying rules have been turned off by default. But, if you find one that you think should be turned off see the [Vale Configuration](#vale-configuration) section and submit a Pull Request for consideration.

#### Turning Off a Vale Rule for a Block of Text

A vale rule can be turned off for a full block of text.

```html
<!-- vale RedHat.DoNotUseTerms = NO : give an explanation -->
You can turn off a specific rule for a block of text.
<!-- vale RedHat.DoNotUseTerms = YES -->
```

Sometimes when `: explanation` is used within the `vale` comment it will not be recognized. In those cases a second comment can be used for the explanation.

```html
<!-- vale RedHat.DoNotUseTerms = NO -->
<!-- give an explanation -->
You can turn off a specific rule for a block of text.
<!-- vale RedHat.DoNotUseTerms = YES -->
```

#### Turning Off a Vale Rule within a Block of Text

A vale rule can be turned off inline so that it applies to part of a block of text.

```html
You can turn off
<!-- vale RedHat.DoNotUseTerms = NO : give an explanation -->a specific rule for
part of<!-- vale RedHat.DoNotUseTerms = YES -->
a block of text.
```

Note that sometimes vale will not detect the inline disabling of rules. When this happens try disabling the rule for a block of text. For example to an entire bullet in a list.

#### Vale Configuration

The `.vale.ini` file provides the configuration for the Vale linter. It determines the rule sets that are used, the types of files that are linted and turns off specific rules. See [the Vale Configuration documentation](https://vale.sh/docs/topics/config) for more detail.

If the `.vale.ini` file is modified then before changes will take effect you will need to:

- run the `vale sync` command.
- restart VSCodium.
