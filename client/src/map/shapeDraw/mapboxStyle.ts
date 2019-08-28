import produce from 'immer';

import styleJson from '../style.json';
import geojsonSource from './roomSource.json';
import geojsonLayer from './roomLayer.json';
import poiSource from './poiSource.json';
import { currentEnv } from '../../common/environment';

(styleJson.sources as any).geojsonSource = geojsonSource;
styleJson.sources.openmaptiles.url = `${currentEnv.TILE_URL}/data/basemap.json`;

(styleJson.sources as any).poiSource = poiSource;

styleJson.sources.library_floorplan.url = `${
  currentEnv.TILE_URL
}/data/floorplan.json`;
styleJson.glyphs = `${currentEnv.TILE_URL}/fonts/{fontstack}/{range}.pbf`;

(styleJson.layers as any).push(geojsonLayer);

/**
 * Use Maputnik for editing the style.json file.
 *
 * https://maputnik.github.io/
 *
 */
const useMapboxStyle = (roomReserved: boolean) => {
  return produce(styleJson, draft => {
    (draft.sources as any).geojsonSource.data.features[0].properties.colorMode = roomReserved
      ? 0
      : 1;
  });
};

export default useMapboxStyle;
