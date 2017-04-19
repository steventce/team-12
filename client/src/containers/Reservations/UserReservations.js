import React, { Component } from 'react';
import { ReservedTableRegularUser }  from '../../components';

class UserReservations extends Component {
  render() {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>{"Users' Reservations"}</h1>
        <ReservedTableRegularUser />
      </div>
    );
  }
}

export default UserReservations;
