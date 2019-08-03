import produce from 'immer';

import styleJson from '../style.json';
import geojsonSource from './roomSource.json';
import geojsonLayer from './roomLayer.json';

(styleJson.sources as any).geojsonSource = geojsonSource;
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
