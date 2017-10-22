/* global Package */
/* eslint-disable prefer-arrow-callback */

Package.describe({
  name: 'hwillson:stub-collections',
  version: '1.0.4',
  summary: 'Stub out Meteor collections with in-memory local collections.',
  documentation: 'README.md',
  git: 'https://github.com/hwillson/meteor-stub-collections.git',
  debugOnly: true,
});

Npm.depends({
  'chai': '4.1.2',
  'sinon': '4.0.1'
})

Package.onUse(function onUse(api) {
  api.use([
    'ecmascript',
    'mongo',
    'underscore',
  ]);
  api.mainModule('stub_collections.js');
});

Package.onTest(function onTest(api) {
  api.use('aldeed:collection2@2.10.0');
  api.use(['ecmascript', 'mongo']);
  api.mainModule('stub_collections.tests.js');
});
