# Creating Views

The purpose of this document is to describe how to create custom API endpoints in farmOS by using Views.

## Outline

## Creating a View

- Documentation for the [Drupal Views Module](https://www.drupal.org/docs/8/core/modules/views).

- log in as `admin`
- Visit Administration -> Structure -> Views (or `http://farmos/admin/structure/views`)
- Create a new View
  - Give the View a display name of "Farm <View Name>"
  - Do not create a Page or a Block
  - Provide a REST endpoint
    - Use a path of `/api/fd2_[endpoint]`
- Configure the View

  - Format: JSON
  - Show: Fields

- Use `farmos/api/fd2_[endpoint]` to test the new endpoint.

## Adding the View to FarmData2

### Installing the View

- Export the view in farmOS.
- Copy into a `.yml` file in `farm_fd2/module/config/optional`
- Remove the `uuid` line
- `npm run build:fd2`
- `installDB --current`

### Accessing the View

- Write a function in `farmosUtil.js` that retrieves data using the API endpoint.
