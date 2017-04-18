import React, { Component } from 'react';
import { ReservedTableRegularUser }  from '../../components';

class UserReservations extends Component {
  render() {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>User Reservations</h1>
        <h4 style={{textAlign: 'center'}}>Reservations made by all users</h4>
        <ReservedTableRegularUser />
      </div>
    );
  }
}

export default UserReservations;