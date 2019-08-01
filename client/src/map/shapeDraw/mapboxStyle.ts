import { useEffect, useState } from 'react';
import { Style } from 'mapbox-gl';
import produce from 'immer';

import styleJson from '../style.json';
import { currentEnv } from '../../common/environment';
import fallbackStyle from './fallbackMapStyle.json';
import geojsonSource from './roomSource.json';
import geojsonLayer from './roomLayer.json';

/**
 * Use Maputnik for editing the style.json file.
 *
 * https://maputnik.github.io/
 *
 */
const useMapboxStyle = (roomReserved: boolean) => {
  const [style, setStyle] = useState<Style | null>(null);

  useEffect(() => {
    const applyStyle = async () => {
      const newStyle = styleJson;
      (newStyle.sources as any).geojsonSource = geojsonSource;
      (newStyle.layers as any).push(geojsonLayer);
      setStyle(newStyle as Style);
    };

    applyStyle();
  }, []);

  return style === null
    ? null
    : produce(style, draft => {
        (draft.sources as any).geojsonSource.data.features[0].properties.colorMode = roomReserved
          ? 0
          : 1;
      });
};

export default useMapboxStyle;
