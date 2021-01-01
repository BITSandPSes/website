import React, { Component } from 'react';
import "./elecHeader.css";
import { Navbar, NavbarBrand, Nav, NavItem, Button, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../../baseUrl';

class ElecHeader extends Component {

  constructor(props) {
    super(props);
    this.loginHandle = this.loginHandle.bind(this);
    this.handlelogout = this.handlelogout.bind(this);
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
   
  handlelogout = async() => {
    try {
      const cookies = document.cookie.split('; ');
      const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];
      const response = await axios({
        url: baseUrl + '/auth/logout',
        method: 'post',
        headers: {
          Authorization: `Bearer ${value}`
        }
      })

      if(response.status === 200) {
        document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        window.sessionStorage.setItem("loggedin","0");
        this.setState({
          userLoggedin: false
        });
        alert("you have been logged out");
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    } catch(error) { 
      alert("could not logout.\nError: "+ error.message);
    }; 
  };
  
  loginHandle = () => {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      window.sessionStorage.setItem("loggedin","1");
    }
    if(window.sessionStorage.getItem("loggedin") === "1")
    {
      return(
        <Button className = "btn nav-linker" onClick = {this.handlelogout}>LOGOUT</Button>  
      );
    }
    else {
      return(
        <a href = "/auth/google" className = "nav-linker">LOGIN</a>
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
                {/* <NavItem className = "d-flex align-items-center nav-items my-3 my-md-0">
                  <this.loginHandle />
                </NavItem> */}
              </Nav>
            </Collapse>
        </div>
      </Navbar>
    );
  }

};

export default ElecHeader;