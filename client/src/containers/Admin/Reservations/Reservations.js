import React, { Component } from 'react';
import { ReservedTableAdmin }  from '../../../components';

class Reservations extends Component {
  render() {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Reserved Resources</h1>
        <ReservedTableAdmin />
      </div>
    );
  }
}

export default Reservations;
