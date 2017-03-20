import React, { Component } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

/*global staffDetails_name:true*/

class HeaderNavbar extends Component {

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
          <Nav>
            <LinkContainer to="/request"><NavItem>Request</NavItem></LinkContainer>
            <LinkContainer to="/reservations"><NavItem>Reservations</NavItem></LinkContainer>
            <LinkContainer to="/admin"><NavItem>Admin Reservations</NavItem></LinkContainer>
            <LinkContainer to="/resources"><NavItem>Resources</NavItem></LinkContainer>
            <LinkContainer to="/locations"><NavItem>Locations</NavItem></LinkContainer>
          </Nav>
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

export default HeaderNavbar;
