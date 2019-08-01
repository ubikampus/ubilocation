FROM klokantech/tileserver-gl:latest

# See this repo for instructions for generating the .mbtiles file https://github.com/openmaptiles/openmaptiles#build
RUN mkdir /server && curl -L -o /server/helsinki.mbtiles "https://drive.google.com/uc?export=download&id=14CSgceZROQ2sg7RYuz9m74iDZ19-UdrE"

WORKDIR /fontbuild
RUN git clone https://github.com/openmaptiles/fonts.git
WORKDIR /fontbuild/fonts
RUN npm i
RUN node ./generate.js
RUN cp -r _output /server/fonts

COPY opts.json /server/opts.json

CMD ["/bin/bash", "/usr/src/app/run.sh", "--config", "/server/opts.json"]
