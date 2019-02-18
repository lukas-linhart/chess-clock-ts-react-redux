import React from 'react';
import ClockFace from '../ClockFace';
import { Store } from 'redux';
import { Provider } from 'react-redux';

const App = ({ store }: { store: Store }) => (
  <Provider store={store}>
    <div className="App">
      <ClockFace />
    </div>
  </Provider>
);

export default App;
