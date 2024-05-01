# Documentation Guide

The FarmData2 documentation is written in [GitHub flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

The project root directory contains the main documentation files (`README.md`, `CODE_OF_CONDUCT.md`, `LICENSE.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`). All other documentation is contained in the `docs` directory and its sub-directories.

Documentation contained in the `docs/components` and the `docs/libraries` sub-directories documents code details. This documentation is automatically generated from the source code. The details of how that documentation is written and generated are contained in the appropriate contribution guides:

- [Components Guide](components.md)
- [Library Guide](libraries.md)

# test2

## Documentation Pre-commit Checks

All markdown (`.md`) files staged for a commit must pass checks by [markdown-link-check](https://github.com/tcort/markdown-link-check), [Vale](https://vale.sh/), and [eslint-plugin-md](https://github.com/leo-buneev/eslint-plugin-md).

### Markdown Link Check

Markdown link check visits each link in the documentation to check that the link is valid (Status Code 200). If any link is not valid then the check will fail and the commit will be canceled. To prevent markdown link check from checking a link, add it to the `.markdown-link-check.json` file.

### eslint md/prettier

### Vale

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

The `.vale.ini` file provides the configuration for the Vale linter. It determines the rule sets that are used, the types of files that are linted and disables specific rules. See [the Vale Configuration documentation](https://vale.sh/docs/topics/config) for more detail.

If the `.vale.ini` file is modified then before changes will take effect you will need to:

- run the `vale sync` command.
- restart VSCodium.
