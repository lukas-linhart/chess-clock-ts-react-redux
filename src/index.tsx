import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import View from './view/View';
import { createStore } from './store';
import * as serviceWorker from './serviceWorker';

const store = createStore();
ReactDOM.render(<View store={store} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
