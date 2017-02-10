import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Router, Route, browserHistory } from 'react-router';
import { App, Request, Locations, Reservations, AdminReservations } from './containers';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';

ReactDOM.render((
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="home" component={Reservations} />
        <Route path="reservations" component={Reservations} />
        <Route path="request" component={Request} />
        <Route path="locations" component={Locations} />
        <Route path="admin" component={AdminReservations} />
      </Route>
    </Router>
  </Provider>
  ),
  document.getElementById('root')
);
