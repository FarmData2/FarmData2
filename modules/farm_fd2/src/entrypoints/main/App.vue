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
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0zNzcuMjk3LDQ0NS4zODhjMTAuNjYxLTE3MC43MzksNzUuMzk0LTMwNS42MjQsNzUuMzk0LTMwNS42MjRjLTEyOC4xNjcsNzIuMDA0LTE1MS41MzYsMjQ4Ljc5OC0xNTUuNjc1LDMyMC45MzkNCgkJCWM1Ljk3NS0yNTYuNTA1LDgyLjkyLTQ0MC44MzUsODIuOTItNDQwLjgzNUMyMjguOTk0LDE0OC4yNDYsMjE2Ljk1MSwzOTkuNjQyLDIxNi43MzMsNDcyLjEyNw0KCQkJYy0yLjMyOC02Mi43NjctMjAuNjM3LTI1Ni4xOTUtMTU2LjIxNy0zMzIuMzYzYzAsMCw2OS4zNTgsMTQ0LjUxOCw3Ni4zMTIsMzIzLjcyOUMxMzIuOTczLDQxNS4yNzEsMTEwLjk5MywzMTkuODM3LDAsMjg2LjIwMw0KCQkJYzAsMCw1Ny42MjYsNjguNjQzLDU3LjYyNiwyMDUuOTI5aDM5Ni43NDhjMC0xMzcuMjg2LDU3LjYyNi0yMDUuOTI5LDU3LjYyNi0yMDUuOTI5DQoJCQlDNDEzLjYxMiwzMTYuMDE3LDM4NS4xNzUsMzk0LjM4MywzNzcuMjk3LDQ0NS4zODh6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo="
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
                    src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNTExLjk1OSA1MTEuOTU5IiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMS45NTkgNTExLjk1OSIgd2lkdGg9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0ibTMxNS4wNyAyOTUuODNjNS4zODItNi4yOTggNC42MzktMTUuNzY3LTEuNjYtMjEuMTQ4bC0xNy40NTEtMTQuOTEyYy02LjI5OC01LjM4Mi0xNS43NjYtNC42MzktMjEuMTQ4IDEuNjYtNS4zODIgNi4yOTgtNC42MzkgMTUuNzY2IDEuNjYgMjEuMTQ4bDE3LjQ1MSAxNC45MTJjNi4yNjggNS4zNjMgMTUuNzQ3IDQuNjYgMjEuMTQ4LTEuNjZ6Ii8+PHBhdGggZD0ibTIyNC44MjUgMzEyLjE1NC0yMS40NTYgOC4xNThjLTcuNzQ0IDIuOTQ0LTExLjYzNCAxMS42MDgtOC42OSAxOS4zNTEgMi45MzcgNy44MjEgMTEuODA5IDExLjYxNyAxOS4zNTIgOC42OWwyMS40NTYtOC4xNThjNy43NDQtMi45NDQgMTEuNjM0LTExLjYwOCA4LjY5LTE5LjM1MS0yLjk0NS03Ljc0NC0xMS42MDYtMTEuNjM2LTE5LjM1Mi04LjY5eiIvPjxwYXRoIGQ9Im0yNzQuODc5IDM0MS4yMDMtOS4xMzggMjEuMDU3Yy0zLjI5OCA3LjYuMTg5IDE2LjQzNCA3Ljc4OSAxOS43MzEgNy40MTUgMy4yNzIgMTYuNDMtLjExMiAxOS43MzEtNy43ODlsOS4xMzgtMjEuMDU3YzMuMjk4LTcuNi0uMTg5LTE2LjQzNC03Ljc4OS0xOS43MzEtNy41OTgtMy4yOTYtMTYuNDMzLjE5LTE5LjczMSA3Ljc4OXoiLz48cGF0aCBkPSJtNDkwLjY5MiAzOTkuNmMtMjMuMzYtMjEuOTU3LTYyLjUzNC0yNS4wMjctODkuNDc5LTcuNjkyLTEuNDQ1LjkwMy0yLjc5Mi45MDMtNC4yNCAwLTUuNTA1LTMuNDM5LTExLjQ5Ni02LjE0Mi0xNy44MDItOC4wMzItMTguOTItNS42NzQtMzguMjc0LTEuNDQtNTMuMSAxMS42MTYtMzUuMjExIDMyLjU1NC0xMDUuNDQyIDMyLjU4Ny0xNDAuNzE0LjA5NC0xNS4zMTQtMTMuNDM5LTM1LjE4OS0xNy40NzctNTQuNTMxLTExLjA3OC01LjU2NyAxLjg0MS0xMC44ODEgNC4zMzEtMTUuNzk2IDcuNC0xLjQ0Ny45MDMtMi43OTQuOTAzLTQuMjQxIDAtNDQuNzAzLTI5LjAyNC0xMTEuMjIyIDEuMjYxLTExMC43ODcgNTQuMjY3LS4wMDEgMzYuMTE2IDMxLjg1IDY1LjQ5OSA3MC45OTkgNjUuNDk5aDM3NGMuMzI0IDAgLjY0Ny0uMDExLjk3LS4wMzEgNTkuNjA3LTMuMDc3IDg4Ljg1Ni03MS44OTkgNDQuNzIxLTExMi4wNDN6Ii8+PHBhdGggZD0ibTE1LjIzNiAyMDAuOTA2IDExOC41NS4xMDEgNzAuMjQ3IDQ3LjY3NWMzNy4xMDcgMjMuNDg5IDcyLjczNS0yOC4yMTcgMzcuNjE4LTU0LjUzMWwtNzYuOTY3LTUyLjUwOGMtMi4zMDEtMS41Ny0zLjY4NC00LjE3LTMuNjk5LTYuOTU1bC0uMjAyLTM2LjUxMmMtLjA1Mi05LjMzNiA5Ljc3My0xNS40MzUgMTguMTE3LTExLjI0N2w3Ny4xMDYgMzguNzAxdjc3LjU4NWMyLjA5NCA0NC4zNTUgNjQuNTQ4IDQzLjYyMiA2Ni4yNDgtLjY3MXYtOTQuMjgxYzAtNS4xMzgtMS4xODYtMTAuMDEzLTMuMjk3LTE0LjM2NC0yLjY4Mi03LjY1LTguMTM5LTE0LjM0NS0xNS44NDMtMTguMzhsLTEzNi40NDktNzEuNDc1Yy02LjM1OC0zLjMzLTEzLjMzNC00LjM3MS0xOS45NzEtMy40MjVsLTEzNi4wNDUgNDQuNDMyYy02LjIwNSAxLjk5My0xMC40MTMgNy43NjUtMTAuNDEzIDE0LjI4MnYxMjYuNTczYzAgOC4yODQgNi43MTUgMTUgMTUgMTV6Ii8+PC9nPjwvc3ZnPg=="
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
                    src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgaGVpZ2h0PSI1MTIiIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNDkgMjloLTR2MTFoLTI2di0xMWgtNHYxMWgtMTV2NGg0NGMuNTUzIDAgMSAuNDQ3IDEgMXMtLjQ0NyAxLTEgMWgtNDAuODg5bDEuMzM5IDEyLjAzYy4xNSAxLjQxLjgzIDIuNjYgMS44MiAzLjU1Ljk5Ljg4IDIuMzEgMS40MiAzLjczIDEuNDJoMTAuNjRjMi41NiAwIDQuOC0xLjc0IDUuNDItNC4yM2wuOTctMy44OWMuMjktMS4xNC45NC0yLjExIDEuODItMi44Ljg3LS42OCAxLjk3LTEuMDggMy4xNS0xLjA4IDIuMzUgMCA0LjQgMS42IDQuOTcgMy44OGwuOTcgMy44OWMuNjIgMi40OSAyLjg2IDQuMjMgNS40MiA0LjIzaDEwLjY0YzIuODUgMCA1LjI0LTIuMTQgNS41NS00Ljk3bDEuMzM5LTEyLjAzaC03Ljg4OWMtLjU1MyAwLTEtLjQ0Ny0xLTFzLjQ0Ny0xIDEtMWgxMXYtNGgtMTV6bS0zMSAzMGgtNWMtLjU1MyAwLTEtLjQ0Ny0xLTFzLjQ0Ny0xIDEtMWg1Yy41NTMgMCAxIC40NDcgMSAxcy0uNDQ3IDEtMSAxem0zMC0xNWMuNTUyIDAgMSAuNDQ4IDEgMXMtLjQ0OCAxLTEgMS0xLS40NDgtMS0xIC40NDgtMSAxLTF6bTMgMTNjLjU1MyAwIDEgLjQ0NyAxIDFzLS40NDcgMS0xIDFoLTVjLS41NTMgMC0xLS40NDctMS0xcy40NDctMSAxLTF6Ii8+PHBhdGggZD0ibTkgMjdoNi4zNTRsLTkuOTYyLTcuNjE4Yy0uNDM4LS4zMzUtLjUyMi0uOTYzLS4xODctMS40MDFzLjk2Mi0uNTIxIDEuNDAxLS4xODdsMTAuMzkzIDcuOTQ4IDEwLjM5My03Ljk0OGMuNDQtLjMzNSAxLjA2Ny0uMjUyIDEuNDAxLjE4Ny4zMzYuNDM4LjI1MiAxLjA2Ni0uMTg3IDEuNDAxbC05Ljk2MiA3LjYxOGg2LjM1NGMyLjMgMCA0LjQxLS44NyA2LTIuMyAxLjg0LTEuNjQgMy00LjA0IDMtNi43di00aC04Yy0yLjQ4IDAtNC43NCAxLjAxLTYuMzYgMi42NC0xLjYzIDEuNjItMi42NCAzLjg4LTIuNjQgNi4zNiAwLTIuNDgtMS4wMS00Ljc0LTIuNjQtNi4zNi0xLjYyLTEuNjMtMy44OC0yLjY0LTYuMzYtMi42NGgtNy45OTh2NGMwIDQuOTcgNC4wMyA5IDkgOXoiLz48cGF0aCBkPSJtNTYgMTRjLTIuNDggMC00Ljc0IDEuMDEtNi4zNiAyLjY0LTEuNjMgMS42Mi0yLjY0IDMuODgtMi42NCA2LjM2IDAtMi40OC0xLjAxLTQuNzQtMi42NC02LjM2LTEuNjItMS42My0zLjg4LTIuNjQtNi4zNi0yLjY0aC0ydjRjMCAyLjU5Ny0uOTMzIDUuMDg4LTIuNTc3IDcuMDQ4IDEuNTMzIDEuMjE4IDMuNDczIDEuOTUyIDUuNTc3IDEuOTUyaDYuNDIxbC02LjA1NC00Ljk1M2MtLjQyOC0uMzUxLS40OTEtLjk4LS4xNDItMS40MDcuMzUxLS40MjguOTc5LS40OSAxLjQwNy0uMTQybDYuMzg4IDUuMjI3IDExLjM3MS04LjY5NmMuNDQtLjMzNSAxLjA2Ny0uMjUzIDEuNDAxLjE4Ny4zMzYuNDM4LjI1MiAxLjA2Ni0uMTg3IDEuNDAxbC0xMC45NjIgOC4zODNoNi4zNTRjNC45NyAwIDktNC4wMyA5LTl2LTRoLTh6Ii8+PC9zdmc+"
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
                    src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PHBhdGggZD0ibTQ5Ni4xODEgNDMyYy0uMDYgMC0uMTIgMC0uMTgxIDAtMTYuNDU5IDAtMjMuODg3IDMuNzE0LTMzLjI5MiA4LjQxNy0xMC44NTggNS40MjktMjMuMTY3IDExLjU4My00Ni43MDggMTEuNTgzLTIzLjYgMC0zNS45MjktNi4xNTctNDYuODA4LTExLjU4OS05LjQwOS00LjY5OS0xNi44NDEtOC40MTEtMzMuMjkyLTguNDExLTE2LjQ2OCAwLTIzLjg5MiAzLjcxNy0zMy4yOTEgOC40MjItMTAuODM5IDUuNDI3LTIzLjEyNyAxMS41NzgtNDYuNjA5IDExLjU3OHMtMzUuNzY5LTYuMTUxLTQ2LjYwOC0xMS41NzhjLTkuNC00LjcwNS0xNi44MjUtOC40MjItMzMuMjkyLTguNDIyLTE2LjQ1MSAwLTIzLjg4MyAzLjcxMS0zMy4yOTIgOC40MTEtMTAuODc4IDUuNDMyLTIzLjIwOCAxMS41ODktNDYuODA4IDExLjU4OS0yMy41NDEgMC0zNS44NDktNi4xNTQtNDYuNzA4LTExLjU4My05LjQwNS00LjcwMi0xNi44MzMtOC40MTctMzMuMjkyLTguNDE3LS4wNiAwLS4xMjEgMC0uMTgxIDAtOC4yMDYuMDE0LTE0LjgxOSA2Ljc0My0xNC44MTkgMTQuOTV2NTAuMDVjMCA4LjI4NCA2LjcxNiAxNSAxNSAxNWg0ODBjOC4yODQgMCAxNS02LjcxNiAxNS0xNXYtNTAuMDVjMC04LjIwNy02LjYxMi0xNC45MzYtMTQuODE5LTE0Ljk1eiIvPjxwYXRoIGQ9Im0xMTEgMzYxLjc1NHY1OC44ODhjNy4yMi0xLjQ5MyAxMi40MTctNC4wOCAxOC40MDQtNy4wNyAzLjU4OS0xLjc5MiA3LjMzOS0zLjY2MiAxMS41OTYtNS4zNjV2LTQ2LjQ1M2MxNC44MDktLjkxNCA0Mi4wNzMtNS4yNTcgNjAuNzkyLTIzLjk3NyAyMC45MTEtMjAuOTExIDIzLjg2OC01Mi42ODUgMjQuMTY4LTY1LjM3NS4wOTYtNC4wODYtMS41MDQtOC4wODQtNC4zOS0xMC45NzEtMi44ODYtMi44ODYtNi44ODUtNC40ODYtMTAuOTcxLTQuMzktMTIuNjkxLjMwMS00NC40NjQgMy4yNTctNjUuMzc2IDI0LjE2OC0xLjUwMiAxLjUwMi0yLjkwMSAzLjA2NS00LjIyNCA0LjY2NnYtMzcuMTQ1YzkuODg2LTExLjQ3MyAyNS0zMy4xOTUgMjUtNTguNzU5IDAtMjkuNTcxLTIwLjM3Ny01NC4xMy0yOS4xMzgtNjMuMzE3LTIuODIxLTIuOTU3LTYuNzgtNC42NTMtMTAuODYyLTQuNjUzLTQuMDgzIDAtOC4wNDIgMS42OTYtMTAuODYzIDQuNjU0LTguNzU5IDkuMTg2LTI5LjEzNiAzMy43NDUtMjkuMTM2IDYzLjMxNiAwIDI1LjU2NCAxNS4xMTQgNDcuMjg2IDI1IDU4Ljc1OXYzNy4xNDVjLTEuMzIzLTEuNjAxLTIuNzIyLTMuMTY0LTQuMjI0LTQuNjY2LTIwLjkxMS0yMC45MTEtNTIuNjg1LTIzLjg2OC02NS4zNzYtMjQuMTY4LTQuMDg2LS4wOTYtOC4wODQgMS41MDQtMTAuOTcxIDQuMzlzLTQuNDg2IDYuODg1LTQuMzkgMTAuOTcxYy4zIDEyLjY5MSAzLjI1NyA0NC40NjQgMjQuMTY4IDY1LjM3NSAxOC43MiAxOC43MiA0NS45ODQgMjMuMDYzIDYwLjc5MyAyMy45Nzd6Ii8+PHBhdGggZD0ibTI4OS4xNzggNDEzLjU5N2MxMC44NjItNS40MzggMjMuMTY3LTExLjU5NyA0Ni43MjItMTEuNTk3IDIzLjUyNyAwIDM1LjgzNiA2LjE0NyA0Ni42OTYgMTEuNTcxIDMuOTI0IDEuOTU5IDcuNTExIDMuNzQyIDExLjU0NSA1LjE2MiAxMy4yMzQtMTMuMzA0IDIzLjQyNy0yOS4zMTkgMjkuOTYtNDcuMjY4bDE4LjQxNS01MC41OTVjMi44MzMtNy43ODUtMS4xODEtMTYuMzkyLTguOTY1LTE5LjIyNmwtNTEuNjgzLTE4LjgxMS0xOC44MTEgNTEuNjgzYy0yLjgzMyA3Ljc4NS0xMS40NDEgMTEuNzk5LTE5LjIyNiA4Ljk2NS03Ljc4NS0yLjgzMy0xMS43OTktMTEuNDQxLTguOTY1LTE5LjIyNmwxOC44MTEtNTEuNjgzIDI4LjE5MSAxMC4yNiA2MC43MDgtMTY2Ljc5NSA0MC42NzEtMTIuMzMzYzQuNTE4LTEuMzcgOC4xMjctNC43ODcgOS43NDItOS4yMjRsMTcuMTAxLTQ2Ljk4NWMyLjgzMy03Ljc4NS0xLjE4LTE2LjM5Mi04Ljk2NS0xOS4yMjZsLTc1LjE3NC0yNy4zNmMtNy43ODUtMi44MzMtMTYuMzkyIDEuMTgtMTkuMjI2IDguOTY1bC0xNy4xMDEgNDYuOTg1Yy0xLjYxNSA0LjQzNy0xLjA0NiA5LjM3NSAxLjUzNCAxMy4zMjhsMjMuMjI4IDM1LjU5MS02MC43MDggMTY2Ljc5NS01MS42ODMtMTguODExYy03Ljc4NS0yLjgzMy0xNi4zOTIgMS4xODEtMTkuMjI2IDguOTY1bC0xOC40MTUgNTAuNTk1Yy0xMi45NiAzNS42MDYtOS44MTkgNzQuMzY2IDguMDAyIDEwNi45OTMgNi40MjEtMS41MjQgMTEuMjg0LTMuOTQ1IDE2LjgyMi02LjcxOHptMTQwLjYwOC0zNzkuMzY3IDQ2Ljk4NSAxNy4xMDEtOS40MDYgMjUuODQyLTI5LjkwNSA5LjA2OS0xNy4wNzktMjYuMTd6Ii8+PC9nPjwvc3ZnPg=="
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
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBpZD0iU29saWQiIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggZD0iTTU3LjcyLDQyLjQ3Myw0NC42MzksNTMuNzVIMjYuMDg4YTEuODE1LDEuODE1LDAsMCwxLTEuODE5LTEuNDU2QTEuNzUxLDEuNzUxLDAsMCwxLDI2LDUwLjI1SDM5Ljc1MmE0LDQsMCwxLDAsMC04SDI2LjU2MmExNS4xODksMTUuMTg5LDAsMCwwLTE3LjExOCwwSDJBMS43NTEsMS43NTEsMCwwLDAsLjI1LDQ0VjYwQTEuNzUxLDEuNzUxLDAsMCwwLDIsNjEuNzVIOS42YTIwLjgsMjAuOCwwLDAsMCw4Ljg3NiwySDQzLjFhMTAuNzUxLDEwLjc1MSwwLDAsMCw3Ljg0NC0zLjRMNjIuNzY0LDQ3LjczYTMuNjQ4LDMuNjQ4LDAsMCwwLTUuMDQ0LTUuMjU3WiIvPjxwYXRoIGQ9Ik0yNC43NzEsMzcuMzc3YTE4LjQ3MywxOC40NzMsMCwwLDEsMi44MTgsMS4zNzNIMzkuNzUyYTcuNTA4LDcuNTA4LDAsMCwxLDcuNSw3LjVjMCwuMjE5LS4wMDkuNDM3LS4wMjguNjVsNy4wNDUtNi4wNzNBMTkuNzU3LDE5Ljc1NywwLDAsMCwzOS43NSwzMi4zMzZ2LTQuMWE5Ljk4Myw5Ljk4MywwLDAsMCw2LjQ4NC0yLjVjMi43MjgtMi43MjgsMi41MTktNy4xMzksMi41MDgtNy4zMjVhMS43NTEsMS43NTEsMCwwLDAtMS42NS0xLjY1MmMtLjE4OS0uMDA3LTQuNi0uMjItNy4zMjYsMi41MDhsLS4wMTYuMDE3VjE0LjhjMS4yMDYtMS4xMDcsMy41LTMuNjI5LDMuNS02LjgsMC00LjA2LTMuNzU2LTcuMDYtNC4xODUtNy4zODlhMS43NSwxLjc1LDAsMCwwLTIuMTMsMEMzNi41MDYuOTQsMzIuNzUsMy45NCwzMi43NSw4YzAsMy4xNzUsMi4yOTQsNS43LDMuNSw2Ljh2NC40NzhsLS4wMTYtLjAxN2MtMi43MjgtMi43MjktNy4xMzUtMi41MTctNy4zMjYtMi41MDhhMS43NTEsMS43NTEsMCwwLDAtMS42NSwxLjY1MmMtLjAxMS4xODYtLjIyLDQuNiwyLjUwOCw3LjMyNWE5Ljk4Nyw5Ljk4NywwLDAsMCw2LjQ4NCwyLjV2NC4xQTE5LjY3OSwxOS42NzksMCwwLDAsMjQuNzcxLDM3LjM3N1oiLz48L3N2Zz4K"
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
