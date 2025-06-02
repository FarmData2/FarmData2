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
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgCgkgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgNDYuMTMyIDQ2LjEzMiIKCSB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNDEuMDE4LDAuMzY1Yy0wLjIzOC0wLjM0Mi0wLjY4OC0wLjQ2MS0xLjA2NC0wLjI4MkMzNS4yMDIsMi4zNDksMjguMjQ1LDcuMDExLDIzLDE2LjE0OAoJCQljMy4wNCw0LjYxNiw1LjY3NSwxMC41NTksNy4wNTcsMTguMTI1YzAuMTgxLTcuNTYxLDEuNjgxLTIzLjg1OSwxMC44NTYtMzIuODEyQzQxLjIxMiwxLjE3MSw0MS4yNTUsMC43MDcsNDEuMDE4LDAuMzY1eiIvPgoJCTxwYXRoIGQ9Ik05LjY3Myw2LjkwNUM5LjUzMSw2LjgxMSw5LjM2OSw2Ljc2Niw5LjIwNyw2Ljc2NmMtMC4yMzEsMC0wLjQ2MSwwLjA5NC0wLjYyOCwwLjI3NWMtMC4yODIsMC4zMDctMC4zLDAuNzczLTAuMDQ0LDEuMTAxCgkJCWM5LjI1MSwxMS44NDgsNi42ODgsMzIuMjk3LDUuOTQ2LDM3LjAwNGMtMC4wMzksMC4yNDcsMC4wMzEsMC40OTgsMC4xOTMsMC42ODhjMC4xNjIsMC4xODgsMC4zOTksMC4yOTksMC42NDgsMC4yOTloMTEuOTA4CgkJCWMwLjIyOSwwLDAuNDQ2LTAuMDkxLDAuNjA2LTAuMjUzczAuMjQ5LTAuMzgxLDAuMjQ2LTAuNjA5QzI3LjgwNiwyMi4yNDIsMTYuNDk4LDExLjM3Niw5LjY3Myw2LjkwNXoiLz4KCQk8cGF0aCBkPSJNMi40NjQsMjcuNTU0Yy0wLjE2NS0wLjEwOC0wLjM4NS0wLjA4MS0wLjUxOSwwLjA2NGMtMC4xMzQsMC4xNDYtMC4xNDMsMC4zNjYtMC4wMjEsMC41MjIKCQkJYzQuMzg3LDUuNjE3LDMuMTcyLDE1LjMxMiwyLjgxOSwxNy41NDNDNC43MjQsNDUuODAxLDQuNzU5LDQ1LjkwOSw0LjgzNCw0NmMwLjA3NywwLjA5LDAuMTksMC4xMzIsMC4zMDgsMC4xMzJoNS42NDUKCQkJYzAuMTA3LDAsMC4yMTEtMC4wMzQsMC4yODctMC4xMXMwLjExOC0wLjE3NiwwLjExNy0wLjI4NEMxMS4wNjEsMzQuODIsNS43MDEsMjkuNjc0LDIuNDY0LDI3LjU1NHoiLz4KCQk8cGF0aCBkPSJNNDQuMTQ2LDIwLjU5Yy0wLjE4Ni0wLjIwMS0wLjQ4Ni0wLjIzOS0wLjcxNi0wLjA4OWMtNC40NjMsMi45MjMtMTEuODU0LDEwLjAyOC0xMi4wMzYsMjUuMDg3CgkJCWMtMC4wMDMsMC4xNDcsMC4wNTksMC4yODEsMC4xNjEsMC4zODhjMC4xMDUsMC4xMDYsMC4yNDYsMC4xNTYsMC4zOTcsMC4xNTZoNy43ODVjMC4xNjQsMCwwLjMxNy0wLjA2MiwwLjQyNC0wLjE4NwoJCQljMC4xMDQtMC4xMjQsMC4xNS0wLjI4MiwwLjEyNi0wLjQ0M2MtMC44MTYtNS4xNjQtMS4zNjItMTEuODk3LDIuODg5LTI0LjE5NUM0NC4zNDQsMjEuMDkzLDQ0LjMzMSwyMC43OTEsNDQuMTQ2LDIwLjU5eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPg=="
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
  min-height: 100vh;
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
