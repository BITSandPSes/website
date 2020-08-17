import React, { Component } from 'react';
import './contact.css';

// const m = require("../../../shared/m green.png");  wrong images need to be replaced
// const p = require("../../../shared/p blue.png");   

class Contact extends Component {
  render() {
    return(
      <div class = "envelope">
        <div class = "container contact-bg">
          <div className = "row justify-content-center">
            <div className = "col-11 col-md-12 contact-big-box mt-4">
              <div className = "row">
                <div className = "col-12 col-md-6 mt-4 mb-2 mb-md-4 pr-md-2">
                  <div className = "mx-1 row blue-contact-box">
                    <div className = "col-12 col-md-4 col-lg-5">
                    </div>
                    <div className = "col-12 d-flex col-md-8 col-lg-7 p-1 mt-2 mt-md-0 align-items-center justify-content-center">
                      <div className = "info-holder">
                        <h3 className = "d-none d-lg-block text-center contact-name-blue">Pratham Gupta</h3>
                        <h5 className = "d-block d-lg-none text-center contact-name-blue">Pratham Gupta</h5>
                        <h6 className = "contact-info">Backend Developer</h6>
                        <h6 className = "contact-info text-center text-md-left mt-4">
                          <a href = "mailto:f20190051@pilani.bits-pilani.ac.in" className = "contact-link">
                            <span className = "fa fa-envelope"></span>&nbsp;&nbsp;f20190051@pilani.bits-pilani.ac.in
                          </a>
                        </h6>
                        <h6 className = "contact-info text-center text-md-left">
                          <a href = "https://github.com/pratham1002" className = "contact-link">
                            <span className = "fa fa-github"></span>&nbsp;&nbsp;pratham1002
                          </a>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className = "col-12 col-md-6 mt-2 mb-4 mt-md-4 pl-md-2">
                  <div className = "mx-1 row green-contact-box">
                    <div className = "col-12 col-md-4 col-lg-5">
                    </div>
                    <div className = "d-flex col-12 col-md-8 col-lg-7 p-1 mt-2 mt-md-0 align-items-center justify-content-center">
                      <div className = "info-holder">
                        <h3 className = "d-none d-lg-block text-center contact-name-green">Madhav Gupta</h3>
                        <h5 className = "d-block d-lg-none text-center contact-name-green">Madhav Gupta</h5>
                        <h6 className = "contact-info">Frontend Developer</h6>
                        <h6 className = "contact-info text-center text-md-left mt-4">
                          <a href = "mailto:f20190063@pilani.bits-pilani.ac.in" className = "contact-link">
                            <span className = "fa fa-envelope" ></span>&nbsp;&nbsp;f20190063@pilani.bits-pilani.ac.in
                          </a>
                        </h6>
                        <h6 className = "contact-info text-center text-md-left">
                          <a href = "https://github.com/madhavgupta211" className = "contact-link">
                            <span className = "fa fa-github"></span>&nbsp;&nbsp;madhavgupta211
                          </a>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className = "col-11 text-center mt-5 contact-disc-column">
              <h6 className = "contact-disclaimer">
                This is our futile attempt to get an internship and scholarships we totally dont deserve. Please bear with us.
              </h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
} 

export default Contact;
