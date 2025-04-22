import { Switch, Router, Route } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import NotFound from './routes/NotFound';
import CircleList from './routes/CircleList';
import CirclecutList from './routes/CirclecutList';

function App() {
  return (<>
    <Switch>
      <Router hook={useHashLocation}>
        <Route path="/" component={NotFound} />
        <Route path="/:exhibition_id/circleList" component={CircleList} />
        <Route path="/:exhibition_id/circlecutList" component={CirclecutList} />
      </Router>
    </Switch>
  </>
  )
}

export default App
