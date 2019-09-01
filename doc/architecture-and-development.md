# Ubilocation-client project architecture

The project consists of three parts, frontend UI found in the client directory,
server (not to be confused with
[ubilocation-server](https://github.com/ubikampus/ubilocation-server)) found in
the auth-server directory and map tile server found in the maptiles directory.

### Frontend UI

User interface utilizes [React](http://reactjs.org/) UI framework, following
idiomatic conventions used in React development. The client follows
feature-based project structure, which means that **directories** are named
after high-level features such as "admin" or "location", whereas technical
names like "mqtt" or "api" are avoided. React hooks API is widely utilized, and
custom hooks are used where applicable. As opposed to typical React
applications, Redux is not used in the project. The outcome is that some deep
prop passing is found in certain components.
[io-ts](https://github.com/gcanti/io-ts) is used for validating data, see
`environment.ts` module for examples.

[Ubimqtt](https://github.com/ubikampus/ubimqtt) library is used for MQTT
communication with the ubilocation-server. For example beacon location data is
received via `useUbiMqtt` React hook found in the `mqttConnection.ts` module.

Mapbox GL JS is used for the map functionality. Most important file for the map
is `style.json`, which is generated using
[Maputnik](https://maputnik.github.io/) tool. Maputnik can be used to configure
the vector tile appearance, so that style.json is not modified manually.

### Auth server

Auth server is a minimal backend service used for admin authentication, storing
application state and sending signed messages to Ubilocation-server. Expressjs
is used as rest api framework. Io-ts library is used in similar fashion as with
client, for examples see `validation.ts` module. Auth server stores state for
public beacons, see `public.ts` module.

### Vector tile server

[Openmaptiles](https://github.com/openmaptiles/openmaptiles) with
[tileserver-gl](https://github.com/klokantech/tileserver-gl) is used for
self-hosting vector map tiles. [GDAL](https://gdal.org) is used for converting
the georeferenced floor plan into tileserver-gl friendly .mbtiles format.
Please see [import-floorplan.md](import-floorplan.md) for additional
information.
