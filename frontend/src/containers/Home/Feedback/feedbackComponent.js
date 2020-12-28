import { Button } from 'reactstrap';
import React, { Component } from 'react';
import './feedback.css';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      isLoggedIn: false
    }
  }

  static getDerivedStateFromProps() {
    if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      return {
        isLoggedIn: true
      };
    }
    return null;
  }

  handleLogin = () => {
    window.localStorage.setItem("googleRedirect","/feedback");
  }

  render() {
    if(this.state.isLoggedIn) {
      return(
        <div className = "envelope">
          <div className = "container">
            <div className = "row row-contents justify-content-center">
              <div className = "col-11 feedback-box">
                <h1 className = "feedback-heading text-left text-md-center">Review 2020</h1>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return(
        <div className = "envelope">
          <div className = "container">
            <div className = "row row-contents justify-content-center">
              <div className = "col-11 feedback-box">
                <h1 className = "feedback-heading text-left text-md-center">Login.</h1>
                <h6 className = "feedback-sub-text text-left text-md-center d-block">
                  To submit your feedback on BITSandPSes for this semester's humanity electives<br/>
                  Please login via your BITS email ID.
                </h6>
                <a href = "/auth/google">
                  <Button className = "elec-search-button mt-4 mb-4 mb-md-5" onClick = {() => { this.handleLogin(); }} >Login</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

}

export default Feedback;
