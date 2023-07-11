import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
