import { Switch, Router, Route } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import NotFound from './routes/NotFound';
import CircleList from './routes/CircleList';
import CirclecutList from './routes/CirclecutList';
import Map from './routes/Map';

function App() {
  return (<>
    <Switch>
      <Router hook={useHashLocation}>
        <Route path="/" component={NotFound} />
        <Route path="/:exhibition_id/list" component={CircleList} />
        <Route path="/:exhibition_id/circlecut" component={CirclecutList} />
        <Route path="/:exhibition_id/map" component={Map} />
      </Router>
    </Switch>
  </>
  )
}

export default App
