import React from 'react';

import {Provider} from 'react-redux';
import store from 'store/store';

import NavigationStackContainer from 'NavigationStackContainer/NavigationStackContainer';
import AppStateContainer from 'AppStateContainer/AppStateContainer';

const App = () => {
  return (
    <Provider store={store}>
      <AppStateContainer />
      <NavigationStackContainer />
    </Provider>
  );
};

export default App;
