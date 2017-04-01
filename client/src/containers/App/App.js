import React, { Component } from 'react';
import { HeaderNavbar } from '../../components';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <HeaderNavbar />
        {this.props.children}
      </div>
    );
  }
}

export default App;
