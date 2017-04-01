import React, { Component } from 'react';
import { ReservedTable }  from '../../components';

class Reservations extends Component {
  render() {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Your Current Bookings</h1>
        <ReservedTable />
      </div>
    );
  }
}

export default Reservations;
