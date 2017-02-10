import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectResource } from '../../redux/modules/Request';

class Request extends Component {
  handleClick() {
    this.props.dispatch(selectResource({ id: 1 }));
  }

  render() {
    return (
      <div>
        <h1>Request Entry</h1>
        <button className="btn" onClick={this.handleClick.bind(this)}>Click</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state };
}

export default connect(mapStateToProps)(Request);
