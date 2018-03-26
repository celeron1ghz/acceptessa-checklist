import React from 'react';
import ReactDOM from 'react-dom';
import Router from './route/Router';
import registerServiceWorker from './registerServiceWorker';

import 'babel-polyfill';

ReactDOM.render(<Router/>, document.getElementById('root'));
registerServiceWorker();
