# Documentation Guide

The FarmData2 documentation is written in [GitHub flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

The project root directory contains the main documentation files (`README.md`, `CODE_OF_CONDUCT.md`, `LICENSE.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`). All other documentation is contained in the `docs` directory and its sub-directories.

Documentation contained in the `docs/components` and the `docs/libraries` sub-directories documents code details. This documentation is automatically generated from the source code. The details of how that documentation is written and generated are contained in the appropriate contribution guides:

- [Components Guide](components.md)
- [Library Guide](libraries.md)

## Documentation Pre-commit Checks

All markdown (`.md`) files staged for a commit must pass checks by [markdown-link-check](https://github.com/tcort/markdown-link-check), [Vale](https://vale.sh/), and [eslint-plugin-md](https://github.com/leo-buneev/eslint-plugin-md).

### Markdown Link Check

Markdown link check visits each link in the files to check that the link is valid (Status Code 200). If any link is not valid then the check will fail and the commit will be canceled. To prevent markdown link check from checking a link, add it to the `.markdown-link-check.json` file.

### eslint Markdown

Eslint checks the files for compliance with the [Markdown Style Guide](https://cirosantilli.com/markdown-style-guide/) with the [`eslint-plugin-md`](https://github.com/leo-buneev/eslint-plugin-md).

#### Turning of eslint on a Line

eslint can be turned off for a line in the `.md` file by placing a comment on the line before the error. esLint is automatically turned back on for following lines.

```html
<!-- eslint ignore - give an explanation -->

# esLint is disabled for this line esLint is re-enabled for this line and all
following lines.
```

#### Configuring the Markdown Style Guide

Individual rules in the style guide can be adjusted or turned off in the `.eslintrc.cjs` file. A full list of the rules can be found in the [remark-preset-lint-markdown-style-guide](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide). More details on the configuration of eslint for markdown can be found in [Sergio Cinos' ESLint for Markdown Guide](https://scinos.dev/posts/2020-11-24-eslint-for-markdown/).

### Vale

Vale is a _prose linter_ that checks the text of the files against a set of style guides. The style guides contain rules for things such as sentence length, basic grammar, comma usage, non-inclusive language, and more. Most of the rules are helpful, but at times you will inevitably find yourself having to reword around some of them. While this is frustrating, on balance it leads to more consistent and readable documentation. The most annoying rules have been turned off by default. But, if you find one that you think should be turned off see the [Vale Configuration](#vale-configuration) section and submit a Pull Request for consideration.

#### Turning Off a Rule for a Block of Text

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

#### Turning Off a Rule Inline

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
