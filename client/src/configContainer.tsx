import React, { useEffect, useState } from 'react';
import Router from './router';
import { fetchConfig, ClientConfig } from './common/environment';

const ConfigContainer = () => {
  const [appConfig, setAppConfig] = useState<null | ClientConfig>(null);
  useEffect(() => {
    const fetchSettings = async () => {
      const config = await fetchConfig();

      setAppConfig(config);
    };

    fetchSettings();
  }, []);

  return appConfig && <Router appConfig={appConfig} />;
};

export default ConfigContainer;
