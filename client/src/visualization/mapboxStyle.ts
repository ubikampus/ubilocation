import { useEffect, useState } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import { Style } from 'mapbox-gl';

import { currentEnv } from '../common/environment';
import fallbackStyle from './fallbackMapStyle.json';
import geojsonSource from './roomSource.json';
import geojsonLayer from './roomLayer.json';

const STYLE_URL =
  'https://api.mapbox.com/styles/v1/ljljljlj/cjxf77ldr0wsz1dqmsl4zko9y';

/**
 * Use default Mapbox vector tiles if MAPBOX_TOKEN is found, otherwise fallback
 * to free Carto Light raster map.
 *
 * See https://wiki.openstreetmap.org/wiki/Tile_servers
 * and https://github.com/CartoDB/basemap-styles
 */
const useMapboxStyle = () => {
  const [style, setStyle] = useState<Style | null>(null);

  useEffect(() => {
    const fetchStyle = async (token: string) => {
      const { data: newStyle } = await axios.get<Style>(
        `${STYLE_URL}?${queryString.stringify({ access_token: token })}`
      );
      (newStyle.sources as any).geojsonSource = geojsonSource;
      (newStyle.layers as any).push(geojsonLayer);
      setStyle(newStyle);
    };

    if (currentEnv.MAPBOX_TOKEN) {
      fetchStyle(currentEnv.MAPBOX_TOKEN);
    } else {
      // there might be some way to remove this type cast
      setStyle(fallbackStyle as Style);
    }
  }, []);

  return style;
};

export default useMapboxStyle;
