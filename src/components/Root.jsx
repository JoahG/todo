'use strict';

import React from 'react';
import { Router, browserHistory } from 'react-router';

// Get routes for app
import routes from '../routes/routes.js';

const Root = () => (
  <Router history={ browserHistory } routes={ routes } />
);

export default Root;
