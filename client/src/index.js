import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';
import Router from './route/Router';
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';

import 'babel-polyfill';
import 'whatwg-fetch';
import 'url-polyfill';

ReactDOM.render(<Router />, document.getElementById('root'));
// registerServiceWorker();
unregister();
