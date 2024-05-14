# Working on a Library

- Details coming soon.

- Tour of a Library

=== Raw Notes Below ===

## Library

Javascript library of FarmData2 custom reusable functions.

- Create a directory for each library
  - `.js` files for the library
  - `.unit.cy.js` files for the unit tests

## farmOS Permissions Checking

A component can check the permissions of the logged in farmOS user using appropriate function in `farmosUtil.js`.

If a permission needs to be checked that is not yet supported it can be added to the `$perms` array in the `permissions` function in `modules/farm_fd2/src/module/Controller/FD2_Controller.php` file.

## Testing

- `test.bash --unit --lib`
- `test.bash --unit --lib --glob="**/farmosUtil/*.unit.cy.js"`
- `test.bash --unit --lib --glob="**/farmosUtil/farmosUtil.getFarmInstance.unit.cy.js"`

Any `it` with an `intercept` should include `{ retries: 4 }` to tolerate some of the flake that appears to go with `cy.intercept`.

Best practice is to [reset the database state before tests are run](https://docs.cypress.io/guides/references/best-practices#State-reset-should-go-before-each-test). Doing this before every test or even at the start of every file adds significantly to the runtime of the test suite. FarmData2 compromises by resetting the database to the DB that was most recently installed (i.e. using `installDB.bash`) before each test run. A test run is one cypress command (e.g. as is done by `test.bash --comp`). Any test that absolutely requires a clean database (i.e. cannot tolerate changes made by prior tests) can reset it in its `before` hook using the following code:

```Javascript
  before(() => {
    cy.task('initDB');
  });
```

You can change the database that will be used for testing by using the `installDB.bash` script manually prior to running the tests. This is useful when you want to run tests against a pre-release of the sample database. For example:

```bash
installDB.bash --release=v3.1.0-development.3 --asset=db.sample.tar.gz
```

Use: `cy.task('log', 'message')` to log messages to the console.
Use: `cy.task('logObject', obj)` to log an object to the console.

- Visible in the console when running headless.
- Click on the task in the test events output to print to console in Cypress gui.

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

- `@category` - organizing the functions in a module into categories.
- [`@example`](https://jsdoc.app/tags-example.html) - as appropriate.
  - example starts on next line and continues until next tag or end of comment.
- [`@link`](https://jsdoc.app/tags-inline-link.html) - links inline with text.
  - blah blah `[<link text>]{@link <link>} blah blah.`
    - use `#module:<moduleName/functionName` for internal links.
- [`@see`](https://jsdoc.app/tags-see.html) - separate element that refers to another element.
  - `@see module:<moduleName>/<functionName>`
  - `@see <link>`

There are additional tags if ever an OO class definition is added.
