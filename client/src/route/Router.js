import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import Error from './Error';

class Router extends React.Component {
  render() {
    return <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={App}/>
          <Route component={Error}/>
        </Switch>
      </div>
    </BrowserRouter>;
  }
}

export default Router;