## Ubilocation-client

[![Build Status](https://travis-ci.org/ubikampus/ubilocation-client.svg?branch=master)](https://travis-ci.org/ubikampus/ubilocation-client)
[![codecov](https://codecov.io/gh/ubikampus/ubilocation-client/branch/master/graph/badge.svg)](https://codecov.io/gh/ubikampus/ubilocation-client)

Ubilocation-client is a map application for Ubikampus Bluetooth tracking project. See
main repo [here](https://github.com/ubikampus/Bluetooth-location-server).

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
1. `docker-compose up` (use `docker-compose up --build --renew-anon-volumes` if
   there are changes to dependencies)
1. Open browser at localhost:8080

See `scripts` section in package.json for other development commands. For
example run client unit tests via `docker-compose exec bluetooth-client npm
test`.

### Configuration

 | env variable | description
----|----
INITIAL_LATITUDE | latitude as float for the initial map position (WGS84)
INITIAL_LONGITUDE | longitude as float for the initial map position
INITIAL_ZOOM | mapbox zoom level, from 1 to 22
MINIMUM_ZOOM | mapbox minimum zoom level
ADMIN_USER | username for admin login (/admin)
ADMIN_PASSWORD | password for admin login
JWT_SECRET | secret key for JWT sign/verify process
MQTT_URL | URL for mqtt bus, used for location data, calibration messages and location sharing. E.g. `wss://example.com:9002/mqtt`


### Deploy to production

* Set secret environment variables (ADMIN_* and JWT_SECRET) in .env file and
  other configuration into docker-compose.prod.yml. See explanation for
  configuration parameters above.

* Generate a separate production private key for as described above into
  `pkey/pkey.pem`.

* Run `docker-compose -f docker-compose.prod.yml up --build`

### Import your own floor plan

See [How to import your own floor plan and OSM basemap](doc/import-floorplan.md).

### Deprecated 3D visualization

Before the current mapping solution was created, the project produced a 3D visualization. This visualization featured a 3D model of the library based on architectural schematics. To access this much earlier version of the project, see the branch [3d-visualization](https://github.com/ubikampus/ubilocation-client/tree/3d-visualization).
