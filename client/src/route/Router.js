import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import Error from './Error';

class Router extends React.Component {
  render() {
    return <HashRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Error}/>
          <Route exact path="/:exhibition" component={App}/>
          <Route component={Error}/>
        </Switch>
      </div>
    </HashRouter>;
  }
}

export default Router;