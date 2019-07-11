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
1. Optional - install editor plugins for Tslint and Styled-components, for
   example if using VS code:
   [Tslint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
   and [Styled
   components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
1. Optional - copy .env.example to .env and set mapbox API token. If not
   supplied, fallback raster map is used.
1. `docker-compose up`
1. Open browser at localhost:8080

See `scripts` section in package.json for other development commands. For
example run client unit tests via `docker-compose exec bluetooth-client npm
test`.

### Deploy client to production

Make sure mapbox api key is set to .env file.

1. cd to repo root
1. `docker-compose run -v $(pwd)/client/dist:/client/dist bluetooth-client npm run build`
1. cd to client and run `npx gh-pages -d dist`

http://ubikampus.github.io/bluetooth-dev-visualizer
