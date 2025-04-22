import { useEffect, useState } from 'react';
import { Switch, Router, Route } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';

import Root from './routes/Root';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    window.fetch(window.location.origin + '/api/me', { credentials: 'include' })
      .then(data => data.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.log('me error:', err);
      });

  }, []);

  // if (!user) {
  //   return (
  //     <>
  //       <Header user={null} />
  //       <div className='container' style={{ paddingTop: '8vh' }}>
  //         <div>ログインしてください</div>
  //       </div>
  //     </>
  //   );
  // }

  return (
    <Switch>
      <Router hook={useHashLocation}>
        {/* <Header user={user} /> */}
        <Route path="/" component={Root} />
        {/* <Route path="/qrReader/jsQr" component={JsQrReader} /> */}
      </Router>
    </Switch>
  )
}

export default App
