import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  GenuineBusContainer,
  MockBusContainer,
} from './visualization/screenContainer';
import UrlPromptContainer from './location/urlPromptContainer';
import { apiRoot } from './common/environment';
import MapContainer from './visualization/mapContainer';

const NotFound = () => <h3>404 page not found</h3>;

const Router = () => {
  return (
    <BrowserRouter basename={apiRoot()}>
      <Switch>
        <Route exact path="/" component={UrlPromptContainer} />
        <Route exact path="/map" component={MapContainer} />
        <Route exact path="/mockviz" component={MockBusContainer} />
        <Route exact path="/viz" component={GenuineBusContainer} />

        {/* catch everything else */}
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
