# Tips for Testing in FarmData2

THIS IS DRAFT AND NEEDS TO BE REVISED

The following bullet points provide some helpful tips for testing entry points:

- Tests can output messages to the console using the `cy.task` command.
  - Use `cy.task('log', 'message')` to log text messages.
  - Use: `cy.task('logObject', obj)` to log an object to the console.



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

- Any `it` with an `intercept` should include `{ retries: 4 }` to tolerate some of the flake that appears to go with `cy.intercept`.


- `clear()` fields with content before `type()`ing in them
- `blur()` any field that was `type()`d in or `clear()`ed before doing a submit or relying on its value. If changing lots of fields, then only need to `blur` the last one.
- When setting or checking the value of a _selector_ or _numeric_ input be sure to get the element from the sub-component (e.g. `selector-input` or `numeric-input`). Some methods work on the parent component, but others do not. So, it is always safest to work with the `*-input` element itself.
- If a contained `data-cy` is unique to a page just use it. `cy.get`ting the parent element and using `find` may not work. Very strange behavior.
- To use `select()` on a component built on top of the `SelectorBase` component, you must use `cy.get(<component>).find('selector-input').select(<item>)`