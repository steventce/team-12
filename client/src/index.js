import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './app';
import AdminReservations from './admin/reservations';
import Locations from './admin/locations';
import Request from './request';
import Reservations from './reservations';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="home" component={Reservations} />
      <Route path="reservations" component={Reservations} />
      <Route path="request" component={Request} />
      <Route path="locations" component={Locations} />
      <Route path="admin" component={AdminReservations} />
    </Route>
  </Router>
  ),
  document.getElementById('root')
);
