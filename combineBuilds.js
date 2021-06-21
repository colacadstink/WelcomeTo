#!/usr/bin/node
const fs = require('fs-extra');
const copyNodeModules = require('copy-node-modules');

fs.emptyDirSync('dist');

fs.copySync('backend/dist', 'dist');
fs.copySync('frontend/dist/WelcomeToFrontend', 'dist/public');

copyNodeModules('backend', 'dist', {devDependencies: false}, (err) => {
  if(!err) {
    process.exit(0);
  } else {
    console.error(err);
    process.exit(1);
  }
});
