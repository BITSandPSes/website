import React, { Component } from 'react';
import "./elecHeader.css";
import { Navbar, NavbarBrand, Nav, NavItem, Button, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../../baseUrl';
import authUrl from '../../../authRedirect';

class ElecHeader extends Component {

  constructor(props) {
    super(props);
    this.loginHandle = this.loginHandle.bind(this);
    this.state = {
      userLoggedin: true,
      isNavOpen: false,
      routetoStation: false
    };
  }

  toggleNav = () => {
    this.setState({
      isNavOpen: !this.state.isNavOpen
    });
  }
  
  loginHandle = ({loggedIn, logout, url}) => {
    console.log(logout);
    if(loggedIn)
    {
      return(
        <Button className = "btn nav-linker" onClick = {() => { logout(); }}>LOGOUT</Button>  
      );
    }
    else {
      return(
        <a href = { authUrl + "&state=" + url } className = "nav-linker">LOGIN</a>
      );
    }
  };
  
  render() {
    return(
      <Navbar light className = "white-bg-navbar-elec fixed-top" expand = "md">
        <div className = "container">
          <NavbarBrand className = "mr-auto"><NavLink to = {this.props.urlinfo.url + '/home'} className = "text-decoration-none" >
            <h1 className = "navbrand-title">  
              <span className = "green">BITS</span>
              <span className = "dark-grey">and</span>
              <span className = "blue">PS</span>
              <span className = "dark-grey">es</span>
              <h6 className = "d-inline navbrand-font">(Electives)</h6>  
            </h1>
          </NavLink></NavbarBrand>
            <NavbarToggler onClick = {this.toggleNav} className = "nav-toggler" />
            <Collapse isOpen = {this.state.isNavOpen} navbar className="flex-grow-0">
              <Nav navbar>
                <NavItem className = "d-flex align-items-center nav-items my-3 my-md-0">
                  <NavLink className = "nav-linker" to = {this.props.urlinfo.url + '/home'} >HOME</NavLink>
                </NavItem>
                <NavItem className = "d-flex align-items-center nav-items my-3 my-md-0">
                  <NavLink className = "nav-linker" to = {this.props.urlinfo.url + '/contact'}>CONTACT US</NavLink>
                </NavItem>
                <NavItem className = "d-flex align-items-center nav-items my-3 my-md-0">
                  <Link className = "nav-linker" to = "/1/home" >STATIONS</Link>
                </NavItem>
                <NavItem className = "d-flex align-items-center nav-items my-3 my-md-0">
                  <this.loginHandle 
                   loggedIn = {this.props.loggedIn}
                   logout = {this.props.logout}
                   url = {this.props.location.pathname}/>
                </NavItem>
              </Nav>
            </Collapse>
        </div>
      </Navbar>
    );
  }

};

export default ElecHeader;