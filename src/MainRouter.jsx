// src/MainRouter.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './components/App';
import AlertPage from './AlertPage';

const MainRouter = () => {
  return (
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/alert" component={AlertPage} /> {/* Alert page route */}
    </Switch>
  );
};

export default MainRouter;
