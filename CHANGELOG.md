## [1.3.0](https://github.com/FarmData2/FarmData2/compare/v1.2.0...v1.3.0) (2024-06-10)


### Features

* **comp:** add picklist base component ([#187](https://github.com/FarmData2/FarmData2/issues/187)) ([b67dc11](https://github.com/FarmData2/FarmData2/commit/b67dc11908bd55579b042659c05d73fd025df6f2))
* **dev:** adds the vue force dev plugin to firefox ([#206](https://github.com/FarmData2/FarmData2/issues/206)) ([ddfa604](https://github.com/FarmData2/FarmData2/commit/ddfa60417c1bb220d10abff3aea3abafabce19bf)), closes [#133](https://github.com/FarmData2/FarmData2/issues/133)
* **dev:** enables launching dev environment via GitPod ([#236](https://github.com/FarmData2/FarmData2/issues/236)) ([fbaa5d0](https://github.com/FarmData2/FarmData2/commit/fbaa5d0f7060b6d68bc2ff7d7b38cf57441c0cc0)), closes [#77](https://github.com/FarmData2/FarmData2/issues/77) [#4](https://github.com/FarmData2/FarmData2/issues/4)
* **dev:** improves addEntrypoint.bash script ([#289](https://github.com/FarmData2/FarmData2/issues/289)) ([ce83da6](https://github.com/FarmData2/FarmData2/commit/ce83da69e95e8d9b7e11965fa43892f1da1721f6)), closes [#282](https://github.com/FarmData2/FarmData2/issues/282)
* **dev:** improves entry point creation and maintainence ([#251](https://github.com/FarmData2/FarmData2/issues/251)) ([2fe30ff](https://github.com/FarmData2/FarmData2/commit/2fe30ff216217c547242db95093d234f6774d209)), closes [#243](https://github.com/FarmData2/FarmData2/issues/243) [#189](https://github.com/FarmData2/FarmData2/issues/189) [#170](https://github.com/FarmData2/FarmData2/issues/170)
* **docs:** updates the core documentation ([#239](https://github.com/FarmData2/FarmData2/issues/239)) ([726ddb9](https://github.com/FarmData2/FarmData2/commit/726ddb9bfdf67d89368efd5acd3a32ba6bdc3fed)), closes [#4](https://github.com/FarmData2/FarmData2/issues/4) [#5](https://github.com/FarmData2/FarmData2/issues/5) [#6](https://github.com/FarmData2/FarmData2/issues/6) [#7](https://github.com/FarmData2/FarmData2/issues/7) [#8](https://github.com/FarmData2/FarmData2/issues/8) [#237](https://github.com/FarmData2/FarmData2/issues/237) [#240](https://github.com/FarmData2/FarmData2/issues/240)
* **examples:** adds a BedPicker example ([#176](https://github.com/FarmData2/FarmData2/issues/176)) ([2b13e07](https://github.com/FarmData2/FarmData2/commit/2b13e07e0c4338723fb1b2410ffbb4757e7df338)), closes [#175](https://github.com/FarmData2/FarmData2/issues/175)
* **examples:** adds a DateSelector example for FD2 Examples ([#172](https://github.com/FarmData2/FarmData2/issues/172)) ([ef81759](https://github.com/FarmData2/FarmData2/commit/ef8175956ca7b4f6324113932d9bba7a6ef5237a)), closes [#171](https://github.com/FarmData2/FarmData2/issues/171)
* **fd2:** Add transplanting entry point ([#200](https://github.com/FarmData2/FarmData2/issues/200)) ([6352e09](https://github.com/FarmData2/FarmData2/commit/6352e098317337b01b289ffc433ec39ed767b366)), closes [#198](https://github.com/FarmData2/FarmData2/issues/198) [#196](https://github.com/FarmData2/FarmData2/issues/196)
* **fd2:** submit tray and direct seedings forms as a transaction ([#212](https://github.com/FarmData2/FarmData2/issues/212)) ([8c082ed](https://github.com/FarmData2/FarmData2/commit/8c082edade3af2b6f52dc5dd9c4f22120589e2b8))


### Fixes

* builds single css file for each module ([#246](https://github.com/FarmData2/FarmData2/issues/246)) ([5d34d44](https://github.com/FarmData2/FarmData2/commit/5d34d44c4f8b05045b03f2800467e36098f981c2)), closes [#202](https://github.com/FarmData2/FarmData2/issues/202)
* **comp:** adds prop to SoilDisturbance component to hide area field ([d0a9071](https://github.com/FarmData2/FarmData2/commit/d0a90710812e295d28bf877d55543a6c94e86dd7)), closes [#238](https://github.com/FarmData2/FarmData2/issues/238)
* **comp:** soil disturbance fix ([#280](https://github.com/FarmData2/FarmData2/issues/280)) ([77ddeea](https://github.com/FarmData2/FarmData2/commit/77ddeea8bf09628e43918bb15dfc901bf3f7f954)), closes [#276](https://github.com/FarmData2/FarmData2/issues/276)
* **comp:** soil disturbance validity fix ([#278](https://github.com/FarmData2/FarmData2/issues/278)) ([5543724](https://github.com/FarmData2/FarmData2/commit/554372462377d9d6472677167e4c4e98cfcfac49)), closes [#276](https://github.com/FarmData2/FarmData2/issues/276)
* **dev:** fd2-up.linux.bash GID numbering logic ([#162](https://github.com/FarmData2/FarmData2/issues/162)) ([2b5115e](https://github.com/FarmData2/FarmData2/commit/2b5115e282a59c8ded35fea57a54e35c776fa5fa))
* **dev:** moves database file to ~/.fd2/ so it persists in docker volume ([#174](https://github.com/FarmData2/FarmData2/issues/174)) ([e01f153](https://github.com/FarmData2/FarmData2/commit/e01f1532114c3e796aa2e4b9fca02b077d34ec18)), closes [#122](https://github.com/FarmData2/FarmData2/issues/122)
* **dev:** pin in cypress version in package.json ([#257](https://github.com/FarmData2/FarmData2/issues/257)) ([ae12b8c](https://github.com/FarmData2/FarmData2/commit/ae12b8c183e7ffb3961a8960eab1a3ff8965b790))
* **dev:** updates documentation for submit tests in entry point templates ([#291](https://github.com/FarmData2/FarmData2/issues/291)) ([aefac0a](https://github.com/FarmData2/FarmData2/commit/aefac0aabc008b9554c8dd2a1b0629020028b4fd))
* **dev:** uses vite to build e2e tests ([#268](https://github.com/FarmData2/FarmData2/issues/268)) ([2f6ec86](https://github.com/FarmData2/FarmData2/commit/2f6ec866879c1e78fa109c9dbf1a05143a4a98c0)), closes [#267](https://github.com/FarmData2/FarmData2/issues/267)
* **docs:** adds a missing coma to line 27 of README.md ([#253](https://github.com/FarmData2/FarmData2/issues/253)) ([95d0e5d](https://github.com/FarmData2/FarmData2/commit/95d0e5d3591e430ef1029836a2e6a6747d0d4381))
* **docs:** adds additional documentation for creating an SSH key ([#258](https://github.com/FarmData2/FarmData2/issues/258)) ([cc97767](https://github.com/FarmData2/FarmData2/commit/cc977678c17469c157ea974ce919fd3886e0998e))
* **docs:** corrected typo in codebase.md ([#254](https://github.com/FarmData2/FarmData2/issues/254)) ([0169dc4](https://github.com/FarmData2/FarmData2/commit/0169dc4b7820f1db525b6d1269e5757c9a662738))
* **docs:** corrected typos in codebase.md ([#252](https://github.com/FarmData2/FarmData2/issues/252)) ([1861dfd](https://github.com/FarmData2/FarmData2/commit/1861dfd4cad488615537dfa50be91546b2df2468))
* **examples:** adds control for date prop to DateSelector example ([#173](https://github.com/FarmData2/FarmData2/issues/173)) ([7ae4f0a](https://github.com/FarmData2/FarmData2/commit/7ae4f0a1ae77bf0177d4ca74d5e979f968390d08))
* **examples:** links the BedPicker example in jsDoc and examples page ([#182](https://github.com/FarmData2/FarmData2/issues/182)) ([25cf07e](https://github.com/FarmData2/FarmData2/commit/25cf07e4e9d865c53974f54fd22d35e014886838))
* **examples:** moves example entry point to examples main menu ([#293](https://github.com/FarmData2/FarmData2/issues/293)) ([6ddc335](https://github.com/FarmData2/FarmData2/commit/6ddc335dc42d0c409d5f829233e16089e2ba719a))
* **examples:** tweaks BedPicker example ([#181](https://github.com/FarmData2/FarmData2/issues/181)) ([3469c4a](https://github.com/FarmData2/FarmData2/commit/3469c4a887ab3f66d55a4ddd25344e21c629c915))
* **examples:** update index of examples ([#294](https://github.com/FarmData2/FarmData2/issues/294)) ([e84b023](https://github.com/FarmData2/FarmData2/commit/e84b023131cc740be146770226430e2232c01d5f)), closes [#259](https://github.com/FarmData2/FarmData2/issues/259)
* **examples:** uses table for prop and state in DateSelector exammple ([#180](https://github.com/FarmData2/FarmData2/issues/180)) ([eeefdb7](https://github.com/FarmData2/FarmData2/commit/eeefdb76442ed7e0581dedd7c4cf0cd6fe3f7f0b))
* **fd2:** adds bed awareness to location selection ([#159](https://github.com/FarmData2/FarmData2/issues/159)) ([c46b5a6](https://github.com/FarmData2/FarmData2/commit/c46b5a6741b044075d94969b3da2228009a1c6ed)), closes [#157](https://github.com/FarmData2/FarmData2/issues/157) [#127](https://github.com/FarmData2/FarmData2/issues/127) [#160](https://github.com/FarmData2/FarmData2/issues/160) [#158](https://github.com/FarmData2/FarmData2/issues/158) [#154](https://github.com/FarmData2/FarmData2/issues/154) [#156](https://github.com/FarmData2/FarmData2/issues/156)
* **fd2:** archives tray seeded plant assets when fully transplanted ([#231](https://github.com/FarmData2/FarmData2/issues/231)) ([7a36c8f](https://github.com/FarmData2/FarmData2/commit/7a36c8feb5de0a549a9a62ee555fdddf9e45a540)), closes [#220](https://github.com/FarmData2/FarmData2/issues/220)
* **fd2:** clears cashed values when terms/assets added to selectors ([#300](https://github.com/FarmData2/FarmData2/issues/300)) ([f231b6c](https://github.com/FarmData2/FarmData2/commit/f231b6cc49ec396f3522bb32dbe24e28d7d48e29)), closes [#103](https://github.com/FarmData2/FarmData2/issues/103)
* **fd2:** enforces asset and log naming conventions ([#235](https://github.com/FarmData2/FarmData2/issues/235)) ([c09f998](https://github.com/FarmData2/FarmData2/commit/c09f998987035f66fcbb6e07a47a95f379db32b9)), closes [#208](https://github.com/FarmData2/FarmData2/issues/208)
* **fd2:** removes area quantity from direct seeding form ([#266](https://github.com/FarmData2/FarmData2/issues/266)) ([f808a5e](https://github.com/FarmData2/FarmData2/commit/f808a5ec8af7eea9e28bd053ec0ef8ecdfc8c104)), closes [#264](https://github.com/FarmData2/FarmData2/issues/264)
* **fd2:** removes unnecessary quantity deletes ([#232](https://github.com/FarmData2/FarmData2/issues/232)) ([5fb743c](https://github.com/FarmData2/FarmData2/commit/5fb743ca3477e70412c2af3d51311276157472a0)), closes [#218](https://github.com/FarmData2/FarmData2/issues/218)
* **fd2:** updates crop list after each transplanting ([#230](https://github.com/FarmData2/FarmData2/issues/230)) ([8890076](https://github.com/FarmData2/FarmData2/commit/88900765cb9eed59b99975f4b89aea4b6862585c)), closes [#225](https://github.com/FarmData2/FarmData2/issues/225)
* **fd2:** updates sticky fields in direct seeding and transplanting forms ([#228](https://github.com/FarmData2/FarmData2/issues/228)) ([0437225](https://github.com/FarmData2/FarmData2/commit/04372256528d409054f4ba2e79729e841831a877)), closes [#224](https://github.com/FarmData2/FarmData2/issues/224) [#226](https://github.com/FarmData2/FarmData2/issues/226)
* **lib:** adds parent 'Category' asset for all equipment categories ([#303](https://github.com/FarmData2/FarmData2/issues/303)) ([16eaef7](https://github.com/FarmData2/FarmData2/commit/16eaef7edaff189503ba78d299c8667365e41e2b)), closes [#298](https://github.com/FarmData2/FarmData2/issues/298)
* **lib:** use console.error instead of console.log for errors ([#216](https://github.com/FarmData2/FarmData2/issues/216)) ([e7968c4](https://github.com/FarmData2/FarmData2/commit/e7968c40b8efdfd762988e8123b03a46b7fb1c74)), closes [#210](https://github.com/FarmData2/FarmData2/issues/210)
* **test:** Direct seeding submission test ([#273](https://github.com/FarmData2/FarmData2/issues/273)) ([b1669f9](https://github.com/FarmData2/FarmData2/commit/b1669f9e15f653adc00df863b450e65aa6d5d15e)), closes [#269](https://github.com/FarmData2/FarmData2/issues/269) [#272](https://github.com/FarmData2/FarmData2/issues/272)
* **test:** fixes the equipment selector test after new db release ([#304](https://github.com/FarmData2/FarmData2/issues/304)) ([25c331a](https://github.com/FarmData2/FarmData2/commit/25c331aed421fbd06cc429ab3757a6ea61b618fb))
* **test:** improves direct_seeding.submission.e2e.cy.js tests ([#269](https://github.com/FarmData2/FarmData2/issues/269)) ([d7c1c5b](https://github.com/FarmData2/FarmData2/commit/d7c1c5b7e6eaa044f6c849490ae9013b656699cf)), closes [#170](https://github.com/FarmData2/FarmData2/issues/170)
* **test:** validates form data in submission e2e test ([#270](https://github.com/FarmData2/FarmData2/issues/270)) ([1695dee](https://github.com/FarmData2/FarmData2/commit/1695deea3467a00bbe1f64c0971bdac9873f2250)), closes [#170](https://github.com/FarmData2/FarmData2/issues/170) [#170](https://github.com/FarmData2/FarmData2/issues/170)


### Refactoring

* **fd2:** Generalize transaction ([#214](https://github.com/FarmData2/FarmData2/issues/214)) ([dbc667c](https://github.com/FarmData2/FarmData2/commit/dbc667cf9da7c2d93ce34d11ec8b2cdfbeac17a6)), closes [#213](https://github.com/FarmData2/FarmData2/issues/213)
* **fd2:** modifies direct seeding App.vue to match new templates ([#285](https://github.com/FarmData2/FarmData2/issues/285)) ([c14fcfc](https://github.com/FarmData2/FarmData2/commit/c14fcfc6412688d53a310ee42d9383208e4eb904)), closes [#27](https://github.com/FarmData2/FarmData2/issues/27)
* **fd2:** refactors tray seeding App.vue ([#281](https://github.com/FarmData2/FarmData2/issues/281)) ([55a6e1d](https://github.com/FarmData2/FarmData2/commit/55a6e1ded96cdedfd20a5e1cc5372dfdc7d1e854)), closes [#277](https://github.com/FarmData2/FarmData2/issues/277)
* **fd2:** updates transplanting to match new templates ([#299](https://github.com/FarmData2/FarmData2/issues/299)) ([633fac8](https://github.com/FarmData2/FarmData2/commit/633fac8591874dd9f2bcf7f4cdc4ff5c2507aaec)), closes [#277](https://github.com/FarmData2/FarmData2/issues/277)
* switches to pgrep for finding servers ([#194](https://github.com/FarmData2/FarmData2/issues/194)) ([47d13ca](https://github.com/FarmData2/FarmData2/commit/47d13ca317d12fbea2a5b66c28ff1b76c78e3730))
* **test:** simplifies the direct seeding unit tests ([#292](https://github.com/FarmData2/FarmData2/issues/292)) ([1bfdc28](https://github.com/FarmData2/FarmData2/commit/1bfdc2857da3b80f8163c92c07c08e076af3b415))
* **test:** simplifies the tray seeding unit tests ([#290](https://github.com/FarmData2/FarmData2/issues/290)) ([1fd4c87](https://github.com/FarmData2/FarmData2/commit/1fd4c87889fb34e0dba09cbe8d756237ceb0374d))


### Tests

* **comp:** fixes update event test in LocationSelector ([#179](https://github.com/FarmData2/FarmData2/issues/179)) ([b3bc266](https://github.com/FarmData2/FarmData2/commit/b3bc26638a239c838f4460bf9ce2a988c19e2d30))

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
