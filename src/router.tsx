import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ScreenContainer from './screenContainer';
import UrlPromptContainer from './urlPromptContainer';

const NotFound = () => <h3>404 page not found</h3>;

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={UrlPromptContainer} />
      <Route path="/viz" component={ScreenContainer} />

      {/* catch everything else */}
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
