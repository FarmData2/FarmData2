## [1.2.0](https://github.com/FarmData2/FarmData2/compare/v1.1.1...v1.2.0) (2024-01-28)


### Chores

* **lib:** remove debugging output ([#118](https://github.com/FarmData2/FarmData2/issues/118)) ([0ee582d](https://github.com/FarmData2/FarmData2/commit/0ee582df68aaf2565005128cf282eb901e2ccee2))


### Continuous Integration

* fixes drupal-releae hook so it copies all changed files ([#116](https://github.com/FarmData2/FarmData2/issues/116)) ([35b0638](https://github.com/FarmData2/FarmData2/commit/35b06387320c471141703164426ea12837650753))


### Documentation

* updates draft of `INSTALL.md` with some additinoal details ([#143](https://github.com/FarmData2/FarmData2/issues/143)) ([14072bf](https://github.com/FarmData2/FarmData2/commit/14072bf669b515c2e477469e5f2be2ce2145db58))


### Features

* **fd2:** adds a direct seeding entry point ([#132](https://github.com/FarmData2/FarmData2/issues/132)) ([32fa656](https://github.com/FarmData2/FarmData2/commit/32fa6561b65de1a9256231d033f0913504829607)), closes [#129](https://github.com/FarmData2/FarmData2/issues/129)
* **fd2:** adds the seeding parent menu ([#131](https://github.com/FarmData2/FarmData2/issues/131)) ([8f51c68](https://github.com/FarmData2/FarmData2/commit/8f51c685c6bde57818d099c36124ea5c0a15ad25)), closes [#129](https://github.com/FarmData2/FarmData2/issues/129)


### Fixes

* **dev:** adds bash trap and cleanup function to test.bash ([#144](https://github.com/FarmData2/FarmData2/issues/144)) ([850b56f](https://github.com/FarmData2/FarmData2/commit/850b56f740306ba56d5159a108956b4b57baf63f)), closes [#141](https://github.com/FarmData2/FarmData2/issues/141)
* **fd2:** Added WSL2 Support ([#121](https://github.com/FarmData2/FarmData2/issues/121)) ([971472c](https://github.com/FarmData2/FarmData2/commit/971472c00a8b0b9c28aa50cf39b60aadc1e01d3d)), closes [#76](https://github.com/FarmData2/FarmData2/issues/76)
* **fd2:** allows the use of multiple log categories ([#148](https://github.com/FarmData2/FarmData2/issues/148)) ([77fb182](https://github.com/FarmData2/FarmData2/commit/77fb1828244b2eaeb3adad54190e5c92d26016f6)), closes [#146](https://github.com/FarmData2/FarmData2/issues/146) [#108](https://github.com/FarmData2/FarmData2/issues/108)
* **fd2:** creates log categories on module install ([#149](https://github.com/FarmData2/FarmData2/issues/149)) ([688bb29](https://github.com/FarmData2/FarmData2/commit/688bb294ffc10365ebf3a50f479f5f881a0b4318)), closes [#139](https://github.com/FarmData2/FarmData2/issues/139)
* **fd2:** migrates creation of unit taxonomy terms to install ([#151](https://github.com/FarmData2/FarmData2/issues/151)) ([2f3d277](https://github.com/FarmData2/FarmData2/commit/2f3d27727dc00713abab3faefe651700e9cca80d)), closes [#139](https://github.com/FarmData2/FarmData2/issues/139)


### Performance Improvements

* **fd2:** Imporve user permissions checking ([#120](https://github.com/FarmData2/FarmData2/issues/120)) ([33f63c8](https://github.com/FarmData2/FarmData2/commit/33f63c878d81cf61521e2c90c3d8df94ee9b6b58)), closes [#119](https://github.com/FarmData2/FarmData2/issues/119)


### Refactoring

* **lib:** refactor caching in the farmosUtil.js library ([#125](https://github.com/FarmData2/FarmData2/issues/125)) ([0135c96](https://github.com/FarmData2/FarmData2/commit/0135c96758a71faf2e8d7b77ac2ffc1a0da30629)), closes [#92](https://github.com/FarmData2/FarmData2/issues/92)
* move asset, quantity, log creation into `farmosUtil.js` ([#138](https://github.com/FarmData2/FarmData2/issues/138)) ([08151aa](https://github.com/FarmData2/FarmData2/commit/08151aae10c915a439763c8f76d97763b91553a9))


### Tests

* **fd2:** rewrite tray seeding tests to follow new conventions ([#155](https://github.com/FarmData2/FarmData2/issues/155)) ([6161918](https://github.com/FarmData2/FarmData2/commit/61619184d778ad65c666d1a8416f0b7c2b079c73)), closes [#140](https://github.com/FarmData2/FarmData2/issues/140) [#145](https://github.com/FarmData2/FarmData2/issues/145)
* **fd2:** tests permission based access to tray seeding ([#117](https://github.com/FarmData2/FarmData2/issues/117)) ([9953389](https://github.com/FarmData2/FarmData2/commit/99533898edb75defabda4c409a8da893ec033be9))
* **lib:** updates tests for log categories created by install ([#153](https://github.com/FarmData2/FarmData2/issues/153)) ([cb3115b](https://github.com/FarmData2/FarmData2/commit/cb3115ba29030a353f1e78d69f77e6b923270438))
* patch the tests to work with smaller sample db ([#128](https://github.com/FarmData2/FarmData2/issues/128)) ([a8cea20](https://github.com/FarmData2/FarmData2/commit/a8cea2074dd54660aac0e6a87adcfc79a1792823))

## [1.1.1](https://github.com/FarmData2/FarmData2/compare/v1.1.0...v1.1.1) (2023-12-21)


### Fixes

* **fd2:** adds drupal permission checking for entry point routes ([#115](https://github.com/FarmData2/FarmData2/issues/115)) ([19cf156](https://github.com/FarmData2/FarmData2/commit/19cf156e1a8fbba51f038e4b582a622ed6c756e7)), closes [#105](https://github.com/FarmData2/FarmData2/issues/105)

## [1.1.0](https://github.com/FarmData2/FarmData2/compare/v1.0.0...v1.1.0) (2023-12-20)


### Build System

* updates entrypoints to include entry_point_name.html files ([#41](https://github.com/FarmData2/FarmData2/issues/41)) ([a8fb357](https://github.com/FarmData2/FarmData2/commit/a8fb357e9a7842374e1f5504b9349b7f63b1e9b4))


### Chores

* a collection of small updates ([#109](https://github.com/FarmData2/FarmData2/issues/109)) ([fc0f79a](https://github.com/FarmData2/FarmData2/commit/fc0f79a69720d1a03ce256db268dd511fe0aa98f))
* adds bootstrap-Vue-next to the entrypoint templates ([#16](https://github.com/FarmData2/FarmData2/issues/16)) ([56d1724](https://github.com/FarmData2/FarmData2/commit/56d1724f136b48388ba2c681b4946ae55e4ef47e))
* adds the createdCount variable to the Vue data element ([#13](https://github.com/FarmData2/FarmData2/issues/13)) ([ce3a85e](https://github.com/FarmData2/FarmData2/commit/ce3a85ec2ee9406c393749c6d6a7211ee3c7494c))
* make eslintrc a .cjs and clean up linting errors ([#60](https://github.com/FarmData2/FarmData2/issues/60)) ([593806b](https://github.com/FarmData2/FarmData2/commit/593806b0486999737bcc89a43e62956435c4f598)), closes [#58](https://github.com/FarmData2/FarmData2/issues/58)
* migrates to farmOS v3 and postgres v13 ([#90](https://github.com/FarmData2/FarmData2/issues/90)) ([02a6054](https://github.com/FarmData2/FarmData2/commit/02a6054b3bdc256710166e4356037e235eb6b70b))
* updates `addEntrypoint.bash` to use development branch ([#11](https://github.com/FarmData2/FarmData2/issues/11)) ([786acde](https://github.com/FarmData2/FarmData2/commit/786acde711b964c3cf4f51532cf0a6972b4b3273))
* updates entrypoint template to not use CounterExample component. ([#12](https://github.com/FarmData2/FarmData2/issues/12)) ([70a6d64](https://github.com/FarmData2/FarmData2/commit/70a6d64b6e977280a8a840ebb42c17f5dd168c55))
* updates project config and npm dependencies ([#40](https://github.com/FarmData2/FarmData2/issues/40)) ([df8bb12](https://github.com/FarmData2/FarmData2/commit/df8bb1251740e048f91a6c72bfc401fe9f1763f5)), closes [#22](https://github.com/FarmData2/FarmData2/issues/22) [#37](https://github.com/FarmData2/FarmData2/issues/37)
* updates the farmos2 image in docker_compose.yml ([#85](https://github.com/FarmData2/FarmData2/issues/85)) ([bcacfbf](https://github.com/FarmData2/FarmData2/commit/bcacfbfa932801f7abbfa53547c576cadadadd21))


### Continuous Integration

* updates lintstaged config to ignore files in libraries/cypress ([#51](https://github.com/FarmData2/FarmData2/issues/51)) ([237f539](https://github.com/FarmData2/FarmData2/commit/237f53998f29e2d7ab6136760920476e9673bfdd))


### Documentation

* **comps:** adds example to NumericInput component docs ([#54](https://github.com/FarmData2/FarmData2/issues/54)) ([dedf899](https://github.com/FarmData2/FarmData2/commit/dedf8996b589225d67e8a48fe9e1fd3da0f0b4a7))


### Features

* adds support for lib.js to module entry points ([#79](https://github.com/FarmData2/FarmData2/issues/79)) ([f324f6c](https://github.com/FarmData2/FarmData2/commit/f324f6c682d8fe9c71908484b59389b320252998)), closes [#25](https://github.com/FarmData2/FarmData2/issues/25) [#26](https://github.com/FarmData2/FarmData2/issues/26) [#66](https://github.com/FarmData2/FarmData2/issues/66)
* **comps:** adds farmOS permission checks to components ([#106](https://github.com/FarmData2/FarmData2/issues/106)) ([4083296](https://github.com/FarmData2/FarmData2/commit/40832969ed8cd228e26bc6a206312b8ce12dd78f)), closes [#63](https://github.com/FarmData2/FarmData2/issues/63)
* **comps:** adds TextDisplay component ([#56](https://github.com/FarmData2/FarmData2/issues/56)) ([54b2554](https://github.com/FarmData2/FarmData2/commit/54b25545b873405b6f880403f1a6c1a147e10b21))
* **comps:** adds the BaseSelector component ([#44](https://github.com/FarmData2/FarmData2/issues/44)) ([35486fe](https://github.com/FarmData2/FarmData2/commit/35486fecd397704b6b74399338e89ac4a961156e))
* **comps:** adds the CommentBox component ([#49](https://github.com/FarmData2/FarmData2/issues/49)) ([46b7a17](https://github.com/FarmData2/FarmData2/commit/46b7a17bbc628a66044bcb37798f3417b9b146ca))
* **comps:** adds the CropSelector component ([#46](https://github.com/FarmData2/FarmData2/issues/46)) ([ce5d372](https://github.com/FarmData2/FarmData2/commit/ce5d372bead4709a33bfa6f81634f2e5bf4b9e84))
* **comps:** adds the DateSelector component ([#48](https://github.com/FarmData2/FarmData2/issues/48)) ([0976394](https://github.com/FarmData2/FarmData2/commit/097639470bdea1b978119178e3e78e1e997aad6b))
* **comps:** adds the LocationSelector component ([#47](https://github.com/FarmData2/FarmData2/issues/47)) ([ecf6d71](https://github.com/FarmData2/FarmData2/commit/ecf6d71679b764ec3917d5b7d5aa842e33ab229a))
* **comps:** adds the NumericInput component ([#52](https://github.com/FarmData2/FarmData2/issues/52)) ([5a7e5fc](https://github.com/FarmData2/FarmData2/commit/5a7e5fc48b0f3c92b289b3d2c054346e81aa6d74))
* **comps:** adds the SubmitResetButtons component ([#50](https://github.com/FarmData2/FarmData2/issues/50)) ([f962e10](https://github.com/FarmData2/FarmData2/commit/f962e10111e9d863ab26989bf000196fd5d21050))
* **comps:** adds TraySizeSelector component ([#55](https://github.com/FarmData2/FarmData2/issues/55)) ([e784a39](https://github.com/FarmData2/FarmData2/commit/e784a3907f2f597c1407b7df3f60f2b385c897ea))
* **dev:** adds script and templates for adding new components ([#43](https://github.com/FarmData2/FarmData2/issues/43)) ([1743d8e](https://github.com/FarmData2/FarmData2/commit/1743d8e17c43b572322768ae7a8627c3159531b5))
* **docs:** adds script for generating the library and component docs ([#45](https://github.com/FarmData2/FarmData2/issues/45)) ([7e3907e](https://github.com/FarmData2/FarmData2/commit/7e3907e37577fa6f2c16f5d74b9b09db6fb67be2))
* **fd2:** add the Tray Seeing entrypoint ([#113](https://github.com/FarmData2/FarmData2/issues/113)) ([5dfbac3](https://github.com/FarmData2/FarmData2/commit/5dfbac319c64eb28b9401457f63ef5630f6408ff)), closes [#10](https://github.com/FarmData2/FarmData2/issues/10)
* **library:** adds farmosUtil library for working with farmOS.js ([#42](https://github.com/FarmData2/FarmData2/issues/42)) ([1c88160](https://github.com/FarmData2/FarmData2/commit/1c881603c87befa24541b21652941e70692d8ace))
* **libs:** adds function for creating asset--plant records ([#75](https://github.com/FarmData2/FarmData2/issues/75)) ([3161023](https://github.com/FarmData2/FarmData2/commit/3161023150bcf15a5258a6347ac215ef4f742c25))
* **libs:** adds utility functions for unit and log-category taxonomy terms ([#65](https://github.com/FarmData2/FarmData2/issues/65)) ([a4bab09](https://github.com/FarmData2/FarmData2/commit/a4bab092d70cbdc0094f4a95392e5fbcda9bb698))
* **lib:** updates to the library functions and tests ([#110](https://github.com/FarmData2/FarmData2/issues/110)) ([bc3dfca](https://github.com/FarmData2/FarmData2/commit/bc3dfcafd34f0f89cf34a57024cbd447aab39527)), closes [#101](https://github.com/FarmData2/FarmData2/issues/101)


### Fixes

* **comp:** clean up components and their tests ([#111](https://github.com/FarmData2/FarmData2/issues/111)) ([7b1cc5c](https://github.com/FarmData2/FarmData2/commit/7b1cc5c1f4209e17480f62cdb1aebd85ea00f7b7)), closes [#101](https://github.com/FarmData2/FarmData2/issues/101)
* **comps:** ensures display is reactive to  prop changes ([#57](https://github.com/FarmData2/FarmData2/issues/57)) ([88c7000](https://github.com/FarmData2/FarmData2/commit/88c7000222076aaab8353dc95fb61cef3311d58b))
* **comps:** fixes empty data property in TextComponent ([#61](https://github.com/FarmData2/FarmData2/issues/61)) ([bf4a3a0](https://github.com/FarmData2/FarmData2/commit/bf4a3a008536519f3ef6798cc7b15ae2bb4a08b0))
* **comps:** updates the addComponent.bash script and templates ([#53](https://github.com/FarmData2/FarmData2/issues/53)) ([d862046](https://github.com/FarmData2/FarmData2/commit/d86204645ef86ed2065db089a811c9bcff4b014d))
* corrects group for docker/db directory ([#86](https://github.com/FarmData2/FarmData2/issues/86)) ([886bafa](https://github.com/FarmData2/FarmData2/commit/886bafa68ad09fe2ea6d8c8064365801aefd61b1))
* creates new farmOS instance of url, client or user change ([#91](https://github.com/FarmData2/FarmData2/issues/91)) ([c2f2f56](https://github.com/FarmData2/FarmData2/commit/c2f2f56657750d2057acde4ff5596bfcfd6291d7))
* gets the printFarmosLogs utility running ([#58](https://github.com/FarmData2/FarmData2/issues/58)) ([dad5287](https://github.com/FarmData2/FarmData2/commit/dad528789a3d54382b1366ed6664cdd679e61a79)), closes [#20](https://github.com/FarmData2/FarmData2/issues/20)
* **library:** patches farmosUtil.js and cleans up documentation ([#97](https://github.com/FarmData2/FarmData2/issues/97)) ([37fcb12](https://github.com/FarmData2/FarmData2/commit/37fcb12dea4ed5dbe6daa8e16db996d8aabf3104)), closes [#73](https://github.com/FarmData2/FarmData2/issues/73)
* **libs:** enable use of farmOS.js when served from module by farmOS ([#81](https://github.com/FarmData2/FarmData2/issues/81)) ([61b74fb](https://github.com/FarmData2/FarmData2/commit/61b74fbe690bb578c40c53dcc829edee66629f7e)), closes [#62](https://github.com/FarmData2/FarmData2/issues/62)
* **libs:** fixes a race condition in getFarmOSInstance ([#74](https://github.com/FarmData2/FarmData2/issues/74)) ([88be5a6](https://github.com/FarmData2/FarmData2/commit/88be5a60835ec809bddab52e82dda9244b067c1c))
* **libs:** patches the farmosUtil library to work in node and in browser ([#59](https://github.com/FarmData2/FarmData2/issues/59)) ([9e357d6](https://github.com/FarmData2/FarmData2/commit/9e357d6cd3676afd1d8da386a442728141837942))
* migrates fd2_school and fd2_examples to drupal 10 ([#112](https://github.com/FarmData2/FarmData2/issues/112)) ([d572b69](https://github.com/FarmData2/FarmData2/commit/d572b694b007aa0b3d5381b8f1c50f0dd504f403))
* update to farmos2 image that includes CORS ([#80](https://github.com/FarmData2/FarmData2/issues/80)) ([283273f](https://github.com/FarmData2/FarmData2/commit/283273fac96356f330bac0156b5ea5d3636726e6))


### Refactoring

* clarifies implementation of getFarmOSIinstance w.r.t. password grant authentication ([#95](https://github.com/FarmData2/FarmData2/issues/95)) ([ebce80f](https://github.com/FarmData2/FarmData2/commit/ebce80f4e47fad782da792815a0655ebcf139b07))
* **lib:** removes need to pass  to farmosUtil functoins ([#71](https://github.com/FarmData2/FarmData2/issues/71)) ([075a72b](https://github.com/FarmData2/FarmData2/commit/075a72b86b28822f6bc188a92745cbf6f09c1338)), closes [#70](https://github.com/FarmData2/FarmData2/issues/70)
* **libs:** caches fetched data ([#69](https://github.com/FarmData2/FarmData2/issues/69)) ([f117afd](https://github.com/FarmData2/FarmData2/commit/f117afdb97f2fa9bc832032a1c243092130d31c3)), closes [#68](https://github.com/FarmData2/FarmData2/issues/68)


### Tests

* modifies cypress tests initialize db before each test run ([#100](https://github.com/FarmData2/FarmData2/issues/100)) ([9a47360](https://github.com/FarmData2/FarmData2/commit/9a47360b28c05336209cdb7252e8c18e0cb79a64)), closes [#99](https://github.com/FarmData2/FarmData2/issues/99) [#88](https://github.com/FarmData2/FarmData2/issues/88)
* runs unit tests as component tests ([#83](https://github.com/FarmData2/FarmData2/issues/83)) ([a81eb11](https://github.com/FarmData2/FarmData2/commit/a81eb11dfc98a5addb1b2580901a7037939fdcfd))

## 1.0.0 (2023-10-27)


### Chores

* add docker-compose.yml to launch FD2 dev environment. ([5058de1](https://github.com/FarmData2/FarmData2/commit/5058de12100ef82f9bdad15d62df78e17d6e2d29))
* add linting/formattign tool configurations ([c8e191d](https://github.com/FarmData2/FarmData2/commit/c8e191d9bb5136c553459c609e32e5a6d138c323))
* add package files for npm dependencies ([4bc9186](https://github.com/FarmData2/FarmData2/commit/4bc91867ccfa8704604499f4ca4d290173a65239))
* adds VSCode configuation ([32fb812](https://github.com/FarmData2/FarmData2/commit/32fb81252b07e88fc27d14d28384adac86ff888f))
* fixes prettier config ([965e681](https://github.com/FarmData2/FarmData2/commit/965e6819e8edd57a57450d0699a90ba245f4da3f))


### Continuous Integration

* adds githooks and GitHub actions for workflow ([e06144e](https://github.com/FarmData2/FarmData2/commit/e06144e540e78260f27f76030ce32d80760e6499))
* changes to release from new FarmData2/FarmData2 repo ([1f7f787](https://github.com/FarmData2/FarmData2/commit/1f7f7876c1084d1d1fa1dc3458e75e9887c28cb4))


### Documentation

* adds rough INSTALL and CONTRIBUTING docs ([#1](https://github.com/FarmData2/FarmData2/issues/1)) ([65860b3](https://github.com/FarmData2/FarmData2/commit/65860b3c01095143e3a214497706f63b9e569eb4))
* initial commit - add readme and licenses ([2547278](https://github.com/FarmData2/FarmData2/commit/254727888fe9ce6bd7f9f5b9bd632a6b6890af82))


### Features

* **fd2:** Add the FD2 Modules and supporting code/structures ([#2](https://github.com/FarmData2/FarmData2/issues/2)) ([51fac33](https://github.com/FarmData2/FarmData2/commit/51fac338c09fb9ecaec0614c6c60bb643b27a974))
