import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/home';
import CreatePoint from './pages/createPoint';

const Routes = () =>{
  return(
    <BrowserRouter>
      <Route exact component={Home} path="/" />
      <Route exact component={CreatePoint} path="/create-point" />
    </BrowserRouter>
  )
}

export default Routes;