import React, { Component } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { getAdmin } from '../../redux/modules/AdminReducer';
import { connect } from 'react-redux';

/*global staffDetails_name:true, staffDetails_empid:true*/  //DO NOT REMOVE THIS

class HeaderNavbar extends Component {

  constructor(props){
    super(props);

    this.state = {isAdmin: false};
  }

  componentDidMount(){
   this.props.dispatch(getAdmin(staffDetails_empid)).then(function(response){
      if(response.payload === ''){
        this.setState({isAdmin: false});
      }
      else{
        this.setState({isAdmin: true});         
      }

    }.bind(this));
  }

  admin(){
    if(this.state.isAdmin){
      return(
        <Nav>
          <LinkContainer to="/request"><NavItem>Request</NavItem></LinkContainer>
          <LinkContainer to="/reservations"><NavItem>Reservations</NavItem></LinkContainer>
          <LinkContainer to="/admin"><NavItem>Admin Reservations</NavItem></LinkContainer>
          <LinkContainer to="/resources"><NavItem>Resources</NavItem></LinkContainer>
          <LinkContainer to="/locations"><NavItem>Locations</NavItem></LinkContainer>          
        </Nav>
      );
    }
    else{
      return (
        <Nav>
          <LinkContainer to="/request"><NavItem>Request</NavItem></LinkContainer>
          <LinkContainer to="/reservations"><NavItem>Reservations</NavItem></LinkContainer>          
        </Nav>

      );      
    }

  }

  render() {
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/home">HSBC Reservation</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            {this.admin()}
          <Nav pullRight>
            <Navbar.Brand>
              <a href="#">Welcome, {staffDetails_name.toLowerCase()}</a>
            </Navbar.Brand>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.db };
}

export default connect(mapStateToProps, null, null, {
  pure: false
})(HeaderNavbar);
