import React, { Component } from 'react';
import "./footer.css";

class Footer extends Component {
  render () {
    return(
      <div className = "footer-row row justify-content-center">
        <h2 className = "footer-title col-12">
          <span className = "green">BITS</span>
          <span className = "dark-grey">and</span>
          <span className = "blue">PS</span>
          <span className = "dark-grey">es</span> 
        </h2>
        <h6 className = "footer-sub col-12">Against the admin, together, always</h6>
        <div className = "footer-links">
          <a><span className = "footer-link fa fa-lg fa-github mr-3"></span></a>
          <a><span className = "footer-link fa fa-lg fa-envelope"></span></a>
        </div>
      </div>
    );
  }
}

export default Footer;