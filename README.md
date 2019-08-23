## Ubikampus bluetooth viz

[![Build Status](https://travis-ci.org/ubikampus/bluetooth-dev-visualizer.svg?branch=master)](https://travis-ci.org/ubikampus/bluetooth-dev-visualizer)
[![codecov](https://codecov.io/gh/ubikampus/bluetooth-dev-visualizer/branch/master/graph/badge.svg)](https://codecov.io/gh/ubikampus/bluetooth-dev-visualizer)

This is a visualization tool for development of Ubikampus bluetooth tracker
project. See main repo
[here](https://github.com/ubikampus/Bluetooth-location-server).

### Requirements

* Node 10+ for tooling
* docker/docker-compose for the runtime

### Development

1. In both `client` and `auth-server` directories run `npm install` (for git hooks and editor dependencies)
1. Generate private key to /auth-server/pkey.pem with command `openssl ecparam
   -genkey -name secp521r1 -noout`
1. Optional - install editor plugins for Tslint and Styled-components, for
   example if using VS code:
   [Tslint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
   and [Styled
   components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
1. `docker-compose up`
1. Open browser at localhost:8080

See `scripts` section in package.json for other development commands. For
example run client unit tests via `docker-compose exec bluetooth-client npm
test`.

### Deploy to production

TODO: document production build

### Import a floor plan

See [How to import your own floor plan and OSM basemap](doc/import-floorplan.md).
