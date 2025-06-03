<template>
  <BContainer
    fluid
    class="launch-pad-container"
    id="launchpad-b-container"
    data-cy="launchpad-b-container"
  >
    <BRow
      class="header-section justify-content-center"
      id="launchpad-header-row"
      data-cy="launchpad-header-row"
    >
      <BCol
        cols="12"
        class="text-center"
        id="launchpad-header-col"
        data-cy="launchpad-header-col"
      >
        <h1
          class="page-title"
          id="launchpad-title"
          data-cy="launchpad-title"
        >
          FarmData2
        </h1>
      </BCol>
    </BRow>

    <div
      class="categories-container"
      id="launchpad-categories-container"
      data-cy="launchpad-categories-container"
    >
      <a id="seeding"></a>
      <BCard
        header="Seeding"
        header-tag="header"
        class="mb-3 category-card"
        id="seeding-card"
        data-cy="seeding-card"
        header-class="category-card-header"
      >
        <div class="card-internal-button-grid">
          <div
            class="activity-item-wrapper"
            id="cover-crop-seeding-wrapper"
            data-cy="cover-crop-seeding-wrapper"
          >
            <BButton
              v-on:click="navigateTo('/fd2/cover_crop_seeding')"
              class="launch-button"
              variant="none"
              id="cover-crop-seeding-button"
              data-cy="cover-crop-seeding-button"
            >
              <div
                class="button-content"
                id="cover-crop-seeding-content"
                data-cy="cover-crop-seeding-content"
              >
                <div
                  class="icon-area"
                  id="cover-crop-seeding-icon-area"
                  data-cy="cover-crop-seeding-icon-area"
                >
                  <img
                    id="cover-crop-seeding-icon"
                    data-cy="cover-crop-seeding-icon"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjxzdmcgZmlsbD0iIzAwMDAwMCIgaGVpZ2h0PSI4MDBweCIgd2lkdGg9IjgwMHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yOC44OTksNDE5LjYyNWgtMTMuMThjLTQuMTk5LDAtNy42MDQsMy40MDQtNy42MDQsNy42MDRjMCw0LjIsMy40MDQsNy42MDQsNy42MDQsNy42MDRoMTMuMTgNCgkJCWM0LjE5OSwwLDcuNjA0LTMuNDA0LDcuNjA0LTcuNjA0QzM2LjUwMyw0MjMuMDI5LDMzLjA5OCw0MTkuNjI1LDI4Ljg5OSw0MTkuNjI1eiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDk1LjYxNSw0MTkuNjI1aC0yOS43NDljLTQuMiwwLTcuNjA0LDMuNDA0LTcuNjA0LDcuNjA0YzAsNC4yLDMuNDAzLDcuNjA0LDcuNjA0LDcuNjA0aDI5Ljc0OQ0KCQkJYzQuMiwwLDcuNjA0LTMuNDA0LDcuNjA0LTcuNjA0QzUwMy4yMTksNDIzLjAyOSw0OTkuODE1LDQxOS42MjUsNDk1LjYxNSw0MTkuNjI1eiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNTA5LjkzMSwzMDYuMzg3Yy00LjIyMy04Ljk1Ny0xMy45NTgtMTMuOTAxLTIzLjY3OS0xMi4wMTJjLTE5Ljc0MiwzLjgyNy00MC4yNDMsMTEuMTY1LTYxLjIwMywyMS44ODYNCgkJCWMyOS4zMjYtNDcuMDk4LDU1LjYwNC04MS40MjEsNTYuMDc5LTgyLjAzN2MzLjMzNC00LjQxMiw1LjIxMi02Ljc4NCw1LjIyOS02LjgwNmM2LjE2LTcuNzUxLDYuMjc4LTE4LjY2OCwwLjI4NS0yNi41NQ0KCQkJYy01Ljk5NC03Ljg4NC0xNi41NDYtMTAuNjkyLTI1LjY1OS02LjgyYy0yMi4xNTEsOS4zOTQtNDQuMjMzLDIzLjg5My02NS45MjksNDMuMjA4YzIxLjYwNS01NC4yMTksNDAuNjIzLTkwLjE5OSw0MC44MTQtOTAuNTYxDQoJCQljNC42NTQtOC43NCwyLjc4Ny0xOS40OTctNC41MzgtMjYuMTZjLTcuMzIzLTYuNjYzLTE4LjIxLTcuNTA1LTI2LjQ3NC0yLjA0OWMtMjUuMjM0LDE2LjY2Ni00OC44ODcsNDEuMTg2LTcwLjQ1MSw3Mi45OTYNCgkJCWMxMC4yNDctNTEuNjQ3LDIwLjY3Ny04Ni4xMTYsMjAuNzg5LTg2LjQ4MmMyLjg5Ny05LjQ2Ny0wLjc5Ni0yMC4wMDMtOS40NTEtMjQuODExYy0xMC44MzEtNi4wMTUtMjIuMTctMC44MDEtMjYuMzc3LDMuMDQ2DQoJCQljLTM1LjczOCwzMi42NzUtNjIuMTEzLDEwMi4zODUtNjIuNjkzLDEwMy45NThjLTAuNTMzLTEuNTA2LTI5LjgyLTc0LjU3Ni02MC4zODctMTA0LjAxNGMtNy4xMzYtNi44NzMtMTcuNjUtOC4zODUtMjYuMDQzLTMuMTkxDQoJCQljLTguMjQ3LDUuMTAyLTEyLjA4MywxNS4yNDItOS4zMjksMjQuNjZjMC4xMTQsMC4zODgsMTEuMDA4LDM3Ljk5NCwyMS4xNjMsOTMuODc2Yy0yMi43NTgtMzUuMTE0LTQ3Ljk0Mi02MS45My03NC45MzItNzkuNzU1DQoJCQljLTguMjYyLTUuNDYtMTkuMTQ4LTQuNjE1LTI2LjQ3MywyLjA0OWMtNy4zMjQsNi42NjItOS4xOSwxNy40Mi00LjUxMywyNi4yMDljMC4zOSwwLjcyLDIwLjEzNiwzNy40ODMsNDEuODIxLDkxLjQwNQ0KCQkJYy0yMi4wMjctMTkuNzc0LTQ0LjQ1OS0zNC41NTgtNjYuOTYtNDQuMTAxYy05LjExNy0zLjg2Ny0xOS42NjgtMS4wNjMtMjUuNjYxLDYuODIxYy01Ljk5Myw3Ljg4MS01Ljg3NCwxOC43OTgsMC4yODYsMjYuNTQ5DQoJCQljMC4yNjMsMC4zMzEsMzYuNzExLDQ3LjE2OSw2MC43MTYsODguMjc3Yy0yMC43NTMtMTAuNTU2LTQxLjA1Ny0xNy44MDktNjAuNjExLTIxLjZjLTkuNzIxLTEuODk1LTE5LjQ1OSwzLjA1My0yMy42OCwxMi4wMQ0KCQkJYy00LjIyMiw4Ljk1NS0xLjgzNSwxOS42MDksNS43OTgsMjUuOTA0YzAuMzI3LDAuMjcxLDMzLjIzNCwyNy41NjgsNzUuMzEsNzEuMTZjNS4xMjMsNS4zMDcsMTAuMjM1LDEwLjcxOSwxNS4zMDEsMTYuMTc2SDU0LjkyDQoJCQljLTQuMTk5LDAtNy42MDQsMy40MDMtNy42MDQsNy42MDRzMy40MDQsNy42MDQsNy42MDQsNy42MDRoNjAuODI5aDAuMDAxYzAsMCw4LjE4NCwwLjI3OSw3Ljc3NC03LjMyMg0KCQkJYy0wLjMzOC02LjI2My0yMC4xMjEtMjUuMDAzLTI5LjQwNS0zNC42MjRjLTQyLjczMS00NC4yNzctNzYuMjMzLTcyLjA0Ny03Ni41NzItNzIuMzI2Yy0yLjI2Ny0xLjg3MS0yLjk3Ni01LjAzMi0xLjcyMi03LjY5MQ0KCQkJYzEuMjUzLTIuNjU3LDQuMTQzLTQuMTI5LDcuMDI5LTMuNTY1YzI1LjE5Niw0Ljg4NSw1MS45MTgsMTYuMDMxLDc5LjQzMywzMy4xMTRjMTcuMjU2LDI5LjU1OCwzMi43MjksNTkuMTM4LDQ2LjE2Nyw4OC4yNzYNCgkJCWMxLjI0MywyLjY5MywzLjkzOCw0LjQxOCw2LjkwNSw0LjQxOGgyMy4wODJjMi4xODMsMCw0LjI2LTAuOTM4LDUuNzA0LTIuNTc1YzEuNDQ0LTEuNjM3LDIuMTE0LTMuODE3LDEuODQtNS45ODINCgkJCUMxNjguMjY5LDI4Ni4zOCw5MC4zMTcsMTQxLjIzMiw4OS41NTgsMTM5LjgzMmMtMS4zODEtMi41OTQtMC44MjYtNS43ODcsMS4zNDgtNy43NjVjMi4xNzUtMS45NzgsNS40MzEtMi4yNjYsNy44NTctMC42MDkNCgkJCWM0Ny43NDIsMzIuNjEsNzYuODA2LDc4LjU3MSw5MC4wOTcsMTA4LjU1NGM3LjU2NSw1Mi4wNjYsMTMuNjc3LDExOC43MjEsOS44NDksMTg1LjA2MWMtMC4wNjYsMC42NzgtMC42MjUsOS40MzgsNy40NjYsOS42NzMNCgkJCWwxMjUuMzEsMC4wODRjMy42OTEsMCw2Ljg1LTIuNjUsNy40ODktNi4yODZjMTAuMy01OC41MzksMjcuNjA1LTExNC4zNzEsNDMuMTk5LTE1Ny40MTgNCgkJCWMyNy44MzUtMjkuODA1LDU2LjM0Mi01MS4wMzMsODQuNzQ4LTYzLjA3OWMyLjcwMy0xLjE0OCw1LjgzNy0wLjMxNSw3LjYxNSwyLjAyNGMxLjc3OSwyLjM0MSwxLjc0NSw1LjU4MS0wLjA4Miw3Ljg4DQoJCQljLTAuMDE5LDAuMDIyLTg0LjI4NywxMDcuMTQ5LTEyMy4xMTIsMjA2LjQ0NmMtMC45MiwyLjM1MS0wLjY1NSw0Ljk5OSwwLjc1OSw3LjA5YzEuNDE0LDIuMDkyLDMuNzczLDMuMzQ0LDYuMjk4LDMuMzQ0aDgwLjQzMQ0KCQkJYzQuMiwwLDcuNjA0LTMuNDAzLDcuNjA0LTcuNjA0cy0zLjQwNC03LjYwNC03LjYwNC03LjYwNGgtMjUuMzA5YzUuMDYzLTUuNDUyLDEwLjE3NC0xMC44NjQsMTUuMzAxLTE2LjE3Ng0KCQkJYzQxLjk1My00My40NjMsNzQuOTg1LTcwLjg5MSw3NS4zMDQtNzEuMTU1QzUxMS43NjUsMzI1Ljk5Niw1MTQuMTUzLDMxNS4zNDEsNTA5LjkzMSwzMDYuMzg3eiBNMTMwLjU0OSwyNzIuMTcyDQoJCQljMC4xNzEsMC4xODUsMC4zNSwwLjM1OSwwLjUzNCwwLjUyMmMxNi4wNjUsNDQuMzE1LDMxLjI4Niw5NS45MTUsMzguNjU4LDE0Ny4yMTNoLTkuNTI5DQoJCQljLTE3Ljc1Ni0zNy45ODUtMzguODc1LTc2LjY0OS02Mi44MTYtMTE0Ljk5NWMtMzIuODI4LTUyLjU4MS01OS41ODItODYuMzQyLTU5Ljg0Ni04Ni42NzVjLTEuODI5LTIuMzAxLTEuODYzLTUuNTQyLTAuMDg1LTcuODgxDQoJCQljMS43NzktMi4zNDEsNC45MS0zLjE3Miw3LjYxNy0yLjAyNUM3My43MzEsMjIwLjQ4MywxMDIuNDg3LDI0MS45NjEsMTMwLjU0OSwyNzIuMTcyeiBNMjE0LjIzLDQxOS41NzgNCgkJCWMzLjk0My04MS4zODctNi4zODUtMTYyLjM1LTE1Ljg5OC0yMTYuNTQzYy0xMC43LTYwLjk1Ni0yMi43MDItMTAyLjI0NS0yMi44MjEtMTAyLjY1M2MtMC44NDEtMi44NzYsMC4yODMtNS45NDQsMi43MzMtNy40Ng0KCQkJYzIuMzA3LTEuNDIzLDUuMjYyLTEuMDUyLDcuMTg5LDAuOTExYzIyLjA4NCwyMi40OTUsNDAuNzA3LDU0LjE1OCw1NS4zNTMsOTQuMTA2YzIuNzE2LDcuNDA4LDUuMzI4LDE1LjIxOCw3Ljc4LDIzLjIxOQ0KCQkJYy0yNi41Myw4NC4yMDQtMzAuNjU5LDE5MC4wMDMtMzAuOTU1LDIwOC40MzRMMjE0LjIzLDQxOS41Nzh6IE0yMzIuODE5LDQxOS42MjRjMC4yOTMtMTguMDc2LDEuOTczLTY2LjE4MSwxMS4yNi0xMjEuOTc4DQoJCQljNi44NTctNDEuMTk3LDE2LjQ2My03OC4xMSwyOC41NTItMTA5LjcxMmMxNS4yNTMtMzkuODc1LDM0LjU2MS03MS40NDgsNTcuMzg4LTkzLjg0NGMxLjIwOC0xLjE4NSw0LjIxOS0yLjg1LDcuODI5LTAuOTA0DQoJCQljMi41ODcsMS4zOTQsMy42NjUsNC41NTQsMi44MDQsNy4zNzJjLTAuMTI3LDAuNDE1LTEyLjc1MSw0Mi4xLTIzLjk2MywxMDIuNTZjLTEwLjA0Myw1NC4xNTUtMjEuMDUyLDEzNS4wODYtMTcuMzc5LDIxNi41MDcNCgkJCUgyMzIuODE5eiBNMzI1LjEyOSw0MTkuNjI1aC0xMC41OTFjLTMuMTI5LTY3Ljc4OCw0LjE1My0xMzUuNDE5LDEyLjQ3Ny0xODcuMDUxYzAuMjE0LTAuMjg0LDQxLjc3My03OC4zODgsODYuMjE5LTEwMS4zOTYNCgkJCWMyLjYxMy0xLjM1Miw1LjY4NS0xLjM3MSw3Ljg1OSwwLjYwOGMyLjE3NSwxLjk3OSwyLjcyNyw1LjE3MSwxLjM0NSw3Ljc2N0M0MjIuMjM5LDEzOS45MzQsMzU3LjM4NSwyNDUuMTc3LDMyNS4xMjksNDE5LjYyNXoNCgkJCSBNNDk0LjQ0MiwzMjAuNTY4Yy0xLjM3LDEuMTMzLTM0LjAyMywyOC4yNDctNzYuNTY0LDcyLjMxOWMtOC40MjYsOC43MjktMTYuODI3LDE3LjcxMy0yNS4wMDUsMjYuNzM4aC0yMy4wODcNCgkJCWMxMS4yMDMtMjYuMTMyLDI1LjEwNC01Mi40NzksMzkuMjUtNzYuNzl2LTAuMDAxYzI3Ljc1NC0xNy4zMjMsNTQuNzA2LTI4LjYwNCw4MC4xMTEtMzMuNTI5YzIuODc4LTAuNTU3LDUuNzc0LDAuOTA2LDcuMDI4LDMuNTY3DQoJCQlDNDk3LjQyOCwzMTUuNTI5LDQ5Ni43MTksMzE4LjY5MSw0OTQuNDQyLDMyMC41Njh6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+"
                    alt="Cover Crop Seeding"
                    class="button-icon"
                  />
                </div>
                <div
                  class="text-area"
                  id="cover-crop-seeding-text-area"
                  data-cy="cover-crop-seeding-text-area"
                >
                  <span
                    class="button-text"
                    id="cover-crop-seeding-text"
                    data-cy="cover-crop-seeding-text"
                    >Cover Crop</span
                  >
                </div>
              </div>
            </BButton>
          </div>

          <div
            class="activity-item-wrapper"
            id="direct-seeding-wrapper"
            data-cy="direct-seeding-wrapper"
          >
            <BButton
              v-on:click="navigateTo('/fd2/direct_seeding')"
              class="launch-button"
              variant="none"
              id="direct-seeding-button"
              data-cy="direct-seeding-button"
            >
              <div
                class="button-content"
                id="direct-seeding-content"
                data-cy="direct-seeding-content"
              >
                <div
                  class="icon-area"
                  id="direct-seeding-icon-area"
                  data-cy="direct-seeding-icon-area"
                >
                  <img
                    id="direct-seeding-icon"
                    data-cy="direct-seeding-icon"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgCgkgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDYuMTMyIDQ2LjEzMiIKCSB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDEuMDE4LDAuMzY1Yy0wLjIzOC0wLjM0Mi0wLjY4OC0wLjQ2MS0xLjA2NC0wLjI4MkMzNS4yMDIsMi4zNDksMjguMjQ1LDcuMDExLDIzLDE2LjE0OAoJCQljMy4wNCw0LjYxNiw1LjY3NSwxMC41NTksNy4wNTcsMTguMTI1YzAuMTgxLTcuNTYxLDEuNjgxLTIzLjg1OSwxMC44NTYtMzIuODEyQzQxLjIxMiwxLjE3MSw0MS4yNTUsMC43MDcsNDEuMDE4LDAuMzY1eiIvPgoJCTxwYXRoIGQ9Ik05LjY3Myw2LjkwNUM5LjUzMSw2LjgxMSw5LjM2OSw2Ljc2Niw5LjIwNyw2Ljc2NmMtMC4yMzEsMC0wLjQ2MSwwLjA5NC0wLjYyOCwwLjI3NWMtMC4yODIsMC4zMDctMC4zLDAuNzczLTAuMDQ0LDEuMTAxCgkJCWM5LjI1MSwxMS44NDgsNi42ODgsMzIuMjk3LDUuOTQ2LDM3LjAwNGMtMC4wMzksMC4yNDcsMC4wMzEsMC40OTgsMC4xOTMsMC42ODhjMC4xNjIsMC4xODgsMC4zOTksMC4yOTksMC42NDgsMC4yOTloMTEuOTA4CgkJCWMwLjIyOSwwLDAuNDQ2LTAuMDkxLDAuNjA2LTAuMjUzczAuMjQ5LTAuMzgxLDAuMjQ2LTAuNjA5QzI3LjgwNiwyMi4yNDIsMTYuNDk4LDExLjM3Niw5LjY3Myw2LjkwNXoiLz4KCQk8cGF0aCBkPSJNMi40NjQsMjcuNTU0Yy0wLjE2NS0wLjEwOC0wLjM4NS0wLjA4MS0wLjUxOSwwLjA2NGMtMC4xMzQsMC4xNDYtMC4xNDMsMC4zNjYtMC4wMjEsMC41MjIKCQkJYzQuMzg3LDUuNjE3LDMuMTcyLDE1LjMxMiwyLjgxOSwxNy41NDNDNC43MjQsNDUuODAxLDQuNzU5LDQ1LjkwOSw0LjgzNCw0NmMwLjA3NywwLjA5LDAuMTksMC4xMzIsMC4zMDgsMC4xMzJoNS42NDUKCQkJYzAuMTA3LDAsMC4yMTEtMC4wMzQsMC4yODctMC4xMXMwLjExOC0wLjE3NiwwLjExNy0wLjI4NEMxMS4wNjEsMzQuODIsNS43MDEsMjkuNjc0LDIuNDY0LDI3LjU1NHoiLz4KCQk8cGF0aCBkPSJNNDQuMTQ2LDIwLjU5Yy0wLjE4Ni0wLjIwMS0wLjQ4Ni0wLjIzOS0wLjcxNi0wLjA4OWMtNC40NjMsMi45MjMtMTEuODU0LDEwLjAyOC0xMi4wMzYsMjUuMDg3CgkJCWMtMC4wMDMsMC4xNDcsMC4wNTksMC4yODEsMC4xNjEsMC4zODhjMC4xMDUsMC4xMDYsMC4yNDYsMC4xNTYsMC4zOTcsMC4xNTZoNy43ODVjMC4xNjQsMCwwLjMxNy0wLjA2MiwwLjQyNC0wLjE4NwoJCQljMC4xMDQtMC4xMjQsMC4xNS0wLjI4MiwwLjEyNi0wLjQ0M2MtMC44MTYtNS4xNjQtMS4zNjItMTEuODk3LDIuODg5LTI0LjE5NUM0NC4zNDQsMjEuMDkzLDQ0LjMzMSwyMC43OTEsNDQuMTQ2LDIwLjU5eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPg=="
                    alt="Direct Seeding"
                    class="button-icon"
                  />
                </div>
                <div
                  class="text-area"
                  id="direct-seeding-text-area"
                  data-cy="direct-seeding-text-area"
                >
                  <span
                    class="button-text"
                    id="direct-seeding-text"
                    data-cy="direct-seeding-text"
                    >Direct</span
                  >
                </div>
              </div>
            </BButton>
          </div>

          <div
            class="activity-item-wrapper"
            id="tray-seeding-wrapper"
            data-cy="tray-seeding-wrapper"
          >
            <BButton
              v-on:click="navigateTo('/fd2/tray_seeding')"
              class="launch-button"
              variant="none"
              id="tray-seeding-button"
              data-cy="tray-seeding-button"
            >
              <div
                class="button-content"
                id="tray-seeding-content"
                data-cy="tray-seeding-content"
              >
                <div
                  class="icon-area"
                  id="tray-seeding-icon-area"
                  data-cy="tray-seeding-icon-area"
                >
                  <img
                    id="tray-seeding-icon"
                    data-cy="tray-seeding-icon"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgCgkgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDYuMTMyIDQ2LjEzMiIKCSB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDEuMDE4LDAuMzY1Yy0wLjIzOC0wLjM0Mi0wLjY4OC0wLjQ2MS0xLjA2NC0wLjI4MkMzNS4yMDIsMi4zNDksMjguMjQ1LDcuMDExLDIzLDE2LjE0OAoJCQljMy4wNCw0LjYxNiw1LjY3NSwxMC41NTksNy4wNTcsMTguMTI1YzAuMTgxLTcuNTYxLDEuNjgxLTIzLjg1OSwxMC44NTYtMzIuODEyQzQxLjIxMiwxLjE3MSw0MS4yNTUsMC43MDcsNDEuMDE4LDAuMzY1eiIvPgoJCTxwYXRoIGQ9Ik05LjY3Myw2LjkwNUM5LjUzMSw2LjgxMSw5LjM2OSw2Ljc2Niw5LjIwNyw2Ljc2NmMtMC4yMzEsMC0wLjQ2MSwwLjA5NC0wLjYyOCwwLjI3NWMtMC4yODIsMC4zMDctMC4zLDAuNzczLTAuMDQ0LDEuMTAxCgkJCWM5LjI1MSwxMS44NDgsNi42ODgsMzIuMjk3LDUuOTQ2LDM3LjAwNGMtMC4wMzksMC4yNDcsMC4wMzEsMC40OTgsMC4xOTMsMC42ODhjMC4xNjIsMC4xODgsMC4zOTksMC4yOTksMC42NDgsMC4yOTloMTEuOTA4CgkJCWMwLjIyOSwwLDAuNDQ2LTAuMDkxLDAuNjA2LTAuMjUzczAuMjQ5LTAuMzgxLDAuMjQ2LTAuNjA5QzI3LjgwNiwyMi4yNDIsMTYuNDk4LDExLjM3Niw5LjY3Myw2LjkwNXoiLz4KCQk8cGF0aCBkPSJNMi40NjQsMjcuNTU0Yy0wLjE2NS0wLjEwOC0wLjM4NS0wLjA4MS0wLjUxOSwwLjA2NGMtMC4xMzQsMC4xNDYtMC4xNDMsMC4zNjYtMC4wMjEsMC41MjIKCQkJYzQuMzg3LDUuNjE3LDMuMTcyLDE1LjMxMiwyLjgxOSwxNy41NDNDNC43MjQsNDUuODAxLDQuNzU5LDQ1LjkwOSw0LjgzNCw0NmMwLjA3NywwLjA5LDAuMTksMC4xMzIsMC4zMDgsMC4xMzJoNS42NDUKCQkJYzAuMTA3LDAsMC4yMTEtMC4wMzQsMC4yODctMC4xMXMwLjExOC0wLjE3NiwwLjExNy0wLjI4NEMxMS4wNjEsMzQuODIsNS43MDEsMjkuNjc0LDIuNDY0LDI3LjU1NHoiLz4KCQk8cGF0aCBkPSJNNDQuMTQ2LDIwLjU5Yy0wLjE4Ni0wLjIwMS0wLjQ4Ni0wLjIzOS0wLjcxNi0wLjA4OWMtNC40NjMsMi45MjMtMTEuODU0LDEwLjAyOC0xMi4wMzYsMjUuMDg3CgkJCWMtMC4wMDMsMC4xNDcsMC4wNTksMC4yODEsMC4xNjEsMC4zODhjMC4xMDUsMC4xMDYsMC4yNDYsMC4xNTYsMC4zOTcsMC4xNTZoNy43ODVjMC4xNjQsMCwwLjMxNy0wLjA2MiwwLjQyNC0wLjE4NwoJCQljMC4xMDQtMC4xMjQsMC4xNS0wLjI4MiwwLjEyNi0wLjQ0M2MtMC44MTYtNS4xNjQtMS4zNjItMTEuODk3LDIuODg5LTI0LjE5NUM0NC4zNDQsMjEuMDkzLDQ0LjMzMSwyMC43OTEsNDQuMTQ2LDIwLjU5eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPg=="
                    alt="Tray Seeding"
                    class="button-icon"
                  />
                </div>
                <div
                  class="text-area"
                  id="tray-seeding-text-area"
                  data-cy="tray-seeding-text-area"
                >
                  <span
                    class="button-text"
                    id="tray-seeding-text"
                    data-cy="tray-seeding-text"
                    >Tray</span
                  >
                </div>
              </div>
            </BButton>
          </div>
        </div>
      </BCard>

      <a id="soil"></a>
      <BCard
        header="Soil"
        header-tag="header"
        class="mb-3 category-card"
        id="soil-card"
        data-cy="soil-card"
        header-class="category-card-header"
      >
        <div class="card-internal-button-grid">
          <div
            class="activity-item-wrapper"
            id="soil-disturbance-wrapper"
            data-cy="soil-disturbance-wrapper"
          >
            <BButton
              v-on:click="navigateTo('/fd2/soil_disturbance')"
              class="launch-button"
              variant="none"
              id="soil-disturbance-button"
              data-cy="soil-disturbance-button"
            >
              <div
                class="button-content"
                id="soil-disturbance-content"
                data-cy="soil-disturbance-content"
              >
                <div
                  class="icon-area"
                  id="soil-disturbance-icon-area"
                  data-cy="soil-disturbance-icon-area"
                >
                  <img
                    id="soil-disturbance-icon"
                    data-cy="soil-disturbance-icon"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgCgkgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDYuMTMyIDQ2LjEzMiIKCSB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDEuMDE4LDAuMzY1Yy0wLjIzOC0wLjM0Mi0wLjY4OC0wLjQ2MS0xLjA2NC0wLjI4MkMzNS4yMDIsMi4zNDksMjguMjQ1LDcuMDExLDIzLDE2LjE0OAoJCQljMy4wNCw0LjYxNiw1LjY3NSwxMC41NTksNy4wNTcsMTguMTI1YzAuMTgxLTcuNTYxLDEuNjgxLTIzLjg1OSwxMC44NTYtMzIuODEyQzQxLjIxMiwxLjE3MSw0MS4yNTUsMC43MDcsNDEuMDE4LDAuMzY1eiIvPgoJCTxwYXRoIGQ9Ik05LjY3Myw2LjkwNUM5LjUzMSw2LjgxMSw5LjM2OSw2Ljc2Niw5LjIwNyw2Ljc2NmMtMC4yMzEsMC0wLjQ2MSwwLjA5NC0wLjYyOCwwLjI3NWMtMC4yODIsMC4zMDctMC4zLDAuNzczLTAuMDQ0LDEuMTAxCgkJCWM5LjI1MSwxMS44NDgsNi42ODgsMzIuMjk3LDUuOTQ2LDM3LjAwNGMtMC4wMzksMC4yNDcsMC4wMzEsMC40OTgsMC4xOTMsMC42ODhjMC4xNjIsMC4xODgsMC4zOTksMC4yOTksMC42NDgsMC4yOTloMTEuOTA4CgkJCWMwLjIyOSwwLDAuNDQ2LTAuMDkxLDAuNjA2LTAuMjUzczAuMjQ5LTAuMzgxLDAuMjQ2LTAuNjA5QzI3LjgwNiwyMi4yNDIsMTYuNDk4LDExLjM3Niw5LjY3Myw2LjkwNXoiLz4KCQk8cGF0aCBkPSJNMi40NjQsMjcuNTU0Yy0wLjE2NS0wLjEwOC0wLjM4NS0wLjA4MS0wLjUxOSwwLjA2NGMtMC4xMzQsMC4xNDYtMC4xNDMsMC4zNjYtMC4wMjEsMC41MjIKCQkJYzQuMzg3LDUuNjE3LDMuMTcyLDE1LjMxMiwyLjgxOSwxNy41NDNDNC43MjQsNDUuODAxLDQuNzU5LDQ1LjkwOSw0LjgzNCw0NmMwLjA3NywwLjA5LDAuMTksMC4xMzIsMC4zMDgsMC4xMzJoNS42NDUKCQkJYzAuMTA3LDAsMC4yMTEtMC4wMzQsMC4yODctMC4xMXMwLjExOC0wLjE3NiwwLjExNy0wLjI4NEMxMS4wNjEsMzQuODIsNS43MDEsMjkuNjc0LDIuNDY0LDI3LjU1NHoiLz4KCQk8cGF0aCBkPSJNNDQuMTQ2LDIwLjU5Yy0wLjE4Ni0wLjIwMS0wLjQ4Ni0wLjIzOS0wLjcxNi0wLjA4OWMtNC40NjMsMi45MjMtMTEuODU0LDEwLjAyOC0xMi4wMzYsMjUuMDg3CgkJCWMtMC4wMDMsMC4xNDcsMC4wNTksMC4yODEsMC4xNjEsMC4zODhjMC4xMDUsMC4xMDYsMC4yNDYsMC4xNTYsMC4zOTcsMC4xNTZoNy43ODVjMC4xNjQsMCwwLjMxNy0wLjA2MiwwLjQyNC0wLjE4NwoJCQljMC4xMDQtMC4xMjQsMC4xNS0wLjI4MiwwLjEyNi0wLjQ0M2MtMC44MTYtNS4xNjQtMS4zNjItMTEuODk3LDIuODg5LTI0LjE5NUM0NC4zNDQsMjEuMDkzLDQ0LjMzMSwyMC43OTEsNDQuMTQ2LDIwLjU5eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPg=="
                    alt="Soil Disturbance"
                    class="button-icon"
                  />
                </div>
                <div
                  class="text-area"
                  id="soil-disturbance-text-area"
                  data-cy="soil-disturbance-text-area"
                >
                  <span
                    class="button-text"
                    id="soil-disturbance-text"
                    data-cy="soil-disturbance-text"
                    >Disturbance</span
                  >
                </div>
              </div>
            </BButton>
          </div>
        </div>
      </BCard>

      <BCard
        header="Others"
        header-tag="header"
        class="mb-3 category-card"
        id="others-card"
        data-cy="others-card"
        header-class="category-card-header"
      >
        <div class="card-internal-button-grid">
          <div
            class="activity-item-wrapper"
            id="transplanting-wrapper"
            data-cy="transplanting-wrapper"
          >
            <BButton
              v-on:click="navigateTo('/fd2/transplanting')"
              class="launch-button"
              variant="none"
              id="transplanting-button"
              data-cy="transplanting-button"
            >
              <div
                class="button-content"
                id="transplanting-content"
                data-cy="transplanting-content"
              >
                <div
                  class="icon-area"
                  id="transplanting-icon-area"
                  data-cy="transplanting-icon-area"
                >
                  <img
                    id="transplanting-icon"
                    data-cy="transplanting-icon"
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgCgkgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDYuMTMyIDQ2LjEzMiIKCSB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDEuMDE4LDAuMzY1Yy0wLjIzOC0wLjM0Mi0wLjY4OC0wLjQ2MS0xLjA2NC0wLjI4MkMzNS4yMDIsMi4zNDksMjguMjQ1LDcuMDExLDIzLDE2LjE0OAoJCQljMy4wNCw0LjYxNiw1LjY3NSwxMC41NTksNy4wNTcsMTguMTI1YzAuMTgxLTcuNTYxLDEuNjgxLTIzLjg1OSwxMC44NTYtMzIuODEyQzQxLjIxMiwxLjE3MSw0MS4yNTUsMC43MDcsNDEuMDE4LDAuMzY1eiIvPgoJCTxwYXRoIGQ9Ik05LjY3Myw2LjkwNUM5LjUzMSw2LjgxMSw5LjM2OSw2Ljc2Niw5LjIwNyw2Ljc2NmMtMC4yMzEsMC0wLjQ2MSwwLjA5NC0wLjYyOCwwLjI3NWMtMC4yODIsMC4zMDctMC4zLDAuNzczLTAuMDQ0LDEuMTAxCgkJCWM5LjI1MSwxMS44NDgsNi42ODgsMzIuMjk3LDUuOTQ2LDM3LjAwNGMtMC4wMzksMC4yNDcsMC4wMzEsMC40OTgsMC4xOTMsMC42ODhjMC4xNjIsMC4xODgsMC4zOTksMC4yOTksMC42NDgsMC4yOTloMTEuOTA4CgkJCWMwLjIyOSwwLDAuNDQ2LTAuMDkxLDAuNjA2LTAuMjUzczAuMjQ5LTAuMzgxLDAuMjQ2LTAuNjA5QzI3LjgwNiwyMi4yNDIsMTYuNDk4LDExLjM3Niw5LjY3Myw2LjkwNXoiLz4KCQk8cGF0aCBkPSJNMi40NjQsMjcuNTU0Yy0wLjE2NS0wLjEwOC0wLjM4NS0wLjA4MS0wLjUxOSwwLjA2NGMtMC4xMzQsMC4xNDYtMC4xNDMsMC4zNjYtMC4wMjEsMC41MjIKCQkJYzQuMzg3LDUuNjE3LDMuMTcyLDE1LjMxMiwyLjgxOSwxNy41NDNDNC43MjQsNDUuODAxLDQuNzU5LDQ1LjkwOSw0LjgzNCw0NmMwLjA3NywwLjA5LDAuMTksMC4xMzIsMC4zMDgsMC4xMzJoNS42NDUKCQkJYzAuMTA3LDAsMC4yMTEtMC4wMzQsMC4yODctMC4xMXMwLjExOC0wLjE3NiwwLjExNy0wLjI4NEMxMS4wNjEsMzQuODIsNS43MDEsMjkuNjc0LDIuNDY0LDI3LjU1NHoiLz4KCQk8cGF0aCBkPSJNNDQuMTQ2LDIwLjU5Yy0wLjE4Ni0wLjIwMS0wLjQ4Ni0wLjIzOS0wLjcxNi0wLjA4OWMtNC40NjMsMi45MjMtMTEuODU0LDEwLjAyOC0xMi4wMzYsMjUuMDg3CgkJCWMtMC4wMDMsMC4xNDcsMC4wNTksMC4yODEsMC4xNjEsMC4zODhjMC4xMDUsMC4xMDYsMC4yNDYsMC4xNTYsMC4zOTcsMC4xNTZoNy43ODVjMC4xNjQsMCwwLjMxNy0wLjA2MiwwLjQyNC0wLjE4NwoJCQljMC4xMDQtMC4xMjQsMC4xNS0wLjI4MiwwLjEyNi0wLjQ0M2MtMC44MTYtNS4xNjQtMS4zNjItMTEuODk3LDIuODg5LTI0LjE5NUM0NC4zNDQsMjEuMDkzLDQ0LjMzMSwyMC43OTEsNDQuMTQ2LDIwLjU5eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPg=="
                    alt="Transplanting"
                    class="button-icon"
                  />
                </div>
                <div
                  class="text-area"
                  id="transplanting-text-area"
                  data-cy="transplanting-text-area"
                >
                  <span
                    class="button-text"
                    id="transplanting-text"
                    data-cy="transplanting-text"
                    >Transplanting</span
                  >
                </div>
              </div>
            </BButton>
          </div>
        </div>
      </BCard>
    </div>

    <div
      id="page-loaded-indicator"
      data-cy="page-loaded"
      v-show="false"
    >
      {{ pageDoneLoading }}
    </div>
  </BContainer>
</template>

<script>
export default {
  data() {
    return {
      createdCount: 0,
    };
  },
  computed: {
    pageDoneLoading() {
      return this.createdCount == 1;
    },
  },
  created() {
    this.createdCount++;
  },
  methods: {
    navigateTo(path) {
      window.location.href = path;
    },
  },
};
</script>

<style>
@import url('@css/fd2-examples.css');
@import url('@css/fd2-mobile.css');

.launch-pad-container {
  background-color: rgb(246, 251, 255);
  padding: 0.5rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header-section {
  margin-bottom: 0;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin-top: 0.25rem;
  margin-bottom: 0.05rem;
  letter-spacing: -0.02em;
}

.categories-container {
  max-width: 1000px;
  margin: 0 auto;
}

.category-card {
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.category-card-header {
  background-color: #f8f9fa;
  font-size: 1.1rem;
  font-weight: 600;
  color: #343a40;
  padding: 0.75rem 1.25rem;
  text-align: center;
}

.card-internal-button-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.75rem;
}

.activity-item-wrapper {
  width: 97px;
  height: 97px;
}

.launch-button {
  background: white !important;
  border: 2px solid rgb(0, 136, 86) !important;
  border-radius: 12px !important; /* Kept from 90px, should still look good */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.launch-button:hover {
  background: rgb(0, 136, 86) !important;
  border-color: rgb(0, 136, 86) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.launch-button:active {
  transform: translateY(0px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.launch-button:focus {
  outline: 2px solid #2e7d32;
  outline-offset: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding-top: 0.75rem;
  padding-right: 0;
  padding-bottom: 0.5rem;
  padding-left: 0;
  box-sizing: border-box;
}

.icon-area {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.6rem;
}

.button-icon {
  width: 34px;
  height: 34px;
  filter: brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%)
    hue-rotate(0deg) brightness(0%) contrast(100%);
  transition: filter 0.2s ease;
}

.launch-button:hover .button-icon {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%)
    hue-rotate(0deg) brightness(100%) contrast(100%);
}

.text-area {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-text {
  font-size: 0.62rem;
  font-weight: 600; /* Bolder text */
  color: rgb(0, 136, 86);
  line-height: 1.1;
  text-align: center;
  transition: color 0.2s ease;
  overflow-wrap: break-word;
}

.launch-button:hover .button-text {
  color: white !important;
}
</style>
