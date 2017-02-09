import React, { Component } from 'react';
import HeaderNavbar from './HeaderNavbar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <HeaderNavbar />
        {this.props.children}
      </div>
    );
  }
}

export default App;
