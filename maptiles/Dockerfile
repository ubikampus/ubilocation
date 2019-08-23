FROM osgeo/gdal:alpine-normal-v2.4.1 AS mbtilebuilder

# See https://github.com/UrbanSystemsLab/raster-to-mbtiles#2-gdal_translate

RUN apk add --no-cache curl

RUN mkdir /build && curl -L -o /build/floorplan.tif "https://drive.google.com/uc?export=download&id=1kesK_DGAlkA7hEJluGMr1NmSsb5vcuP9"

WORKDIR /build

# This is the actual GeoTIFF -> mbtiles conversion
RUN gdal_translate -of MBTILES -co BLOCKSIZE=2048 -co ZOOM_LEVEL_STRATEGY=UPPER floorplan.tif floorplan.mbtiles

# Add different zoom levels.
# TODO: minimum zoom level is 16, how do we add smaller zoom levels?
RUN gdaladdo -r average floorplan.mbtiles 2 4 8 16 32

FROM klokantech/tileserver-gl:latest

# See this repo for instructions for generating the .mbtiles file https://github.com/openmaptiles/openmaptiles#build
RUN mkdir /server && curl -L -o /server/helsinki.mbtiles "https://drive.google.com/uc?export=download&id=14CSgceZROQ2sg7RYuz9m74iDZ19-UdrE"

WORKDIR /fontbuild
RUN git clone https://github.com/openmaptiles/fonts.git
WORKDIR /fontbuild/fonts
RUN npm i
RUN node ./generate.js
RUN cp -r _output /server/fonts

COPY opts.json opts-prod.json /server/
COPY --from=mbtilebuilder /build/floorplan.mbtiles /server

CMD ["/bin/bash", "/usr/src/app/run.sh", "--config", "/server/opts.json"]
