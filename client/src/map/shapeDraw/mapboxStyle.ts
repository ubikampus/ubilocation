import styleJson from '../style.json';
import geojsonSource from './roomSource.json';
import poiSource from './poiSource.json';
import { currentEnv } from '../../common/environment';

(styleJson.sources as any).geojsonSource = geojsonSource;
styleJson.sources.openmaptiles.url = `${currentEnv.TILE_URL}/data/basemap.json`;

(styleJson.sources as any).poiSource = poiSource;

styleJson.sources.library_floorplan.url = `${
  currentEnv.TILE_URL
}/data/floorplan.json`;
styleJson.glyphs = `${currentEnv.TILE_URL}/fonts/{fontstack}/{range}.pbf`;

export default styleJson;
