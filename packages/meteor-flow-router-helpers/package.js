Package.describe({
  git: 'https://github.com/arillo/meteor-flow-router-helpers.git',
  name: 'arillo:flow-router-helpers',
  summary: 'Template helpers for flow-router',
  version: '0.5.3'
});

Package.onUse(function(api) {
  api.use([
    'check',
    'coffeescript',
    'templating',
    'underscore'
  ]);

  api.use([
    'activeroute:core',
    'activeroute:flow-router',
    'activeroute:blaze'
  ], ['client']);

  api.use([
    'kadira:flow-router@2.0.0',
    'meteorhacks:flow-router@1.19.0'
  ], ['client', 'server'], {weak: true});

  api.imply([
    'activeroute:core',
    'activeroute:flow-router',
    'activeroute:blaze'
  ], ['client']);

  api.addFiles([
    'client/helpers.html'
  ], ['client']);

  api.addFiles([
    'client/helpers.coffee'
  ], ['client', 'server']);

  api.export('FlowRouterHelpers', 'server');
});
