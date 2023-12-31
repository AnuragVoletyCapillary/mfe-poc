/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router/immutable';
import history from 'utils/history';
import { userIsAuthenticated } from '../../../utils/authWrapper';

import Cap from '../Cap';
import Login from '../Login';
// import Login from '../components/templates/Login';
import NotFoundPage from '../NotFoundPage';

import GlobalStyle from '../../../global-styles';
import { publicPath } from '../../../config/path';
import config from '../../../config/app';

import RenderRoute from '../../atoms/RenderRoute';
import { PRODUCTION } from '../Cap/constants';

const loginUrl =
  process.env.NODE_ENV === PRODUCTION
    ? config.production.login_url
    : config.development.login_url;

const Protected = userIsAuthenticated(Cap);

const Label = lazy(() => import('HeaderApp/Label'));
export const App = () => (
  <>
    <Suspense fallback={<div>Loading Header...</div>}>
      <Label text="Anurag" type="h5" />
    </Suspense>
  </>
);

export default App;
