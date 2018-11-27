Package.describe({
  name: 'bizar:meteor-bootstrap-wizard',
  summary: 'Bootstrap Wizard - a simple form wizard',
  version: '1.0.1'
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.use('jquery', 'client');
  api.imply('jquery', 'client');
  api.addFiles([
    'bootstrap-wizard/js/jquery.bootstrap.wizard.js',
    'bootstrap-wizard/css/gsdk-base.css'
  ], 'client'
  );
});
