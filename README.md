## Ubikampus bluetooth viz

[![Build Status](https://travis-ci.org/ubikampus/bluetooth-dev-visualizer.svg?branch=master)](https://travis-ci.org/ubikampus/bluetooth-dev-visualizer)
[![codecov](https://codecov.io/gh/ubikampus/bluetooth-dev-visualizer/branch/master/graph/badge.svg)](https://codecov.io/gh/ubikampus/bluetooth-dev-visualizer)

This is a visualization tool for development of Ubikampus bluetooth tracker
project. See main repo
[here](https://github.com/ubikampus/Bluetooth-location-server).

### Requirements

* Node 10+ (not tested with lower versions)

### Development

1. (optional) copy .env.example to .env and set mapbox API token. If not
   supplied, fallback raster map is used.
1. `npm install`
1. Open browser at localhost:8080

See `scripts` section in package.json for other development commands.

### Deploy to production

* `npm run deploy`

http://ubikampus.github.io/bluetooth-dev-visualizer
