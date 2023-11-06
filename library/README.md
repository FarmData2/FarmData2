# Library

Javascript library of FarmData2 custom reusable functions.

- Create a directory for each library
  - `.js` files for the library
  - `.unit.cy.js` files for the unit tests

## Testing

- `test.bash --unit`
- `test.bash --unit --glob="**/farmosUtil/*.unit.cy.js"`
- `test.bash --unit --glob="**/farmosUtil/farmosUtil.getFarmInstance.unit.cy.js"`

## Documentation

- Docs are in `docs/library`

- Generating the docs

  - `npm run doc:gen`

- Viewing the docs

  - `npm run doc:view`

### Documentation Conventions

- Uses [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown/wiki)
  - [JSDoc Tags](https://jsdoc.app/) (see "Block Tags" section)

Minimum expectations:

- [`@module`](https://jsdoc.app/tags-module.html) - in comment at the top of the file.
  - `@module module:<moduleName>`
- [`@description <description>`](https://jsdoc.app/tags-description.html) - to describe the module.
  - Include a short one sentence description here - it is extracted into the documentation index.
- [`@param`](https://jsdoc.app/tags-param.html) - for every parameter on every function.
  - `@param {<type>} name - description of parameter`
  - `@param {<type>} [name = default] - description of parameter`
- `@returns [{type}] [description]` - on every function that returns a value.
  - `@returns <type> [description]`
    - use `{Promise<type>}` for functions that return a promise.
- `@throws` - on any function that throws an exception.
  - `@throws <type> description of when it is thrown.`

Other tags that are often useful:

- [`@example`](https://jsdoc.app/tags-example.html) - as appropriate.
  - example starts on next line and continues until next tag or end of comment.
- [`@link`](https://jsdoc.app/tags-inline-link.html) - links inline with text.
  - blah blah `[<link text>]{@link <link>} blah blah.`
    - use `#module:<moduleName/functionName` for internal links.
- [`@see`](https://jsdoc.app/tags-see.html) - separate element that refers to another element.
  - `@see module:<moduleName>/<functionName>`
  - `@see <link>`

There are additional tags if ever an OO class definition is added.
