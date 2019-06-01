import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GenuineBusContainer, MockBusContainer } from './screenContainer';
import UrlPromptContainer from './urlPromptContainer';

const NotFound = () => <h3>404 page not found</h3>;

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={UrlPromptContainer} />
      <Route exact path="/mockviz" component={MockBusContainer} />
      <Route exact path="/viz" component={GenuineBusContainer} />

      {/* catch everything else */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
