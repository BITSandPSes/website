import { Button, Row, Col, Label } from 'reactstrap';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../../baseUrl';
import { LocalForm, actions, Control, Errors } from 'react-redux-form';
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import './feedback.css';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handlelogout = this.handlelogout.bind(this);
    this.feedbackForm = this.feedbackForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInterestChange = this.onInterestChange.bind(this);
    this.state = {
      isLoggedIn: false,
      submitMore: true,
      noOfFeedbacks: 0,
      interestValue: 3,
      liteValue: 3,
      gradingValue: 3
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

  handleSubmit = (values) => {

  }

  onInterestChange = (value) => {
    this.setState({
      interestValue: value
    });
  }

  onGradingChange = (value) => {
    this.setState({
      gradingValue: value
    });
  }

  onLiteChange = (value) => {
    this.setState({
      liteValue: value
    });
  }

  feedbackForm = () => {
    if(this.state.submitMore) {
      if(this.state.noOfFeedbacks >= 3) {
        alert("You can only submit feedback for three courses");
        this.handlelogout();
        return(
          <Redirect to = {'/' + this.props.match.url.split('/')[1] + '/home'} />
        );
      }
      const marks = {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5'
      };
      return(
        <LocalForm className="px-3" model = "huel" onSubmit = {(values) => this.handleSubmit(values)} >
          <Row className = "form-group align-items-end mt-4">
            <Col xs={12} lg={3} className = "text-left text-lg-right offset-lg-1">
              <Label htmlFor = "courseName" className = "feedback-label mr-lg-0">Course Name</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-2 mt-lg-0">
              <Control.text model = ".courseName"
               className = "feedback-input form-control"
               name = "courseName"
               id = "courseName"
               placeholder = "courseName"
               />
            </Col>
          </Row>
          <Row className = "form-group align-items-end mt-4">
            <Col xs={12} lg={3} className = "text-left text-lg-right offset-lg-1">
              <Label htmlFor = "courseNo" className = "feedback-label">Course No.</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-2 mt-lg-0">
              <Control.text model = ".courseNo"
               className = "feedback-input form-control"
               name = "courseNo"
               id = "courseNo"
               placeholder = "courseNo"
               />
            </Col>
          </Row>
          <Row className = "form-group align-items-start mt-4 mt-lg-5">
            <Col xs={12} lg={4} className = "text-left text-lg-right">
              <Label htmlFor = "experience" className = "feedback-black-label">Rate the overall experience of the course (1-5). 
              How exciting or engaging did you find it to be ?</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-3 mt-lg-0 mb-4 mb-lg-0">
              <Slider
               className="feedback-slider"
               marks={marks}
               min={1}
               max={5}
               step={1}
               onChange = {(value) => { this.onInterestChange(value); }}
               value={this.state.interestValue} 
               />     
            </Col>
          </Row>
          <Row className = "form-group align-items-start mt-4">
            <Col xs={12} lg={4} className = "text-left text-lg-right">
              <Label htmlFor = "experience" className = "feedback-black-label">How lite was the course structure ? Rate its Liteness
              while preparing for exams. (1-5)</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-3 mt-lg-0 mb-4 mb-lg-0">
              <Slider
               className="feedback-slider"
               marks={marks}
               min={1}
               max={5}
               step={1}
               onChange = {(value) => { this.onLiteChange(value); }}
               value={this.state.liteValue} 
               />     
            </Col>
          </Row>
          <Row className = "form-group align-items-start mt-4">
            <Col xs={12} lg={4} className = "text-left text-lg-right">
              <Label htmlFor = "experience" className = "feedback-black-label">How lenient was the grading scheme? Rate 1
              if very lenient and 5 for CDC level sadism.</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-3 mt-lg-0 mb-4 mb-lg-0">
              <Slider
               className="feedback-slider"
               marks={marks}
               min={1}
               max={5}
               step={1}
               onChange = {(value) => { this.onGradingChange(value); }}
               value={this.state.gradingValue} 
               />     
            </Col>
          </Row>
          <Row className = "form-group align-items-center mt-4">
            <Col xs={12} lg={3} className = "text-left text-lg-right offset-lg-1">
              <Label htmlFor = "goodFeedback" className = "feedback-label">Positive feedback you could infer about
              the course</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-2 mt-lg-0">
              <Control.textarea model = ".goodFeedback"
               className = "feedback-input form-control"
               name = "goodFeedback"
               id = "goodFeedback"
               placeholder = ""
               rows={5}
               />
            </Col>
          </Row>
          <Row className = "form-group align-items-center mt-4">
            <Col xs={12} lg={3} className = "text-left text-lg-right offset-lg-1">
              <Label htmlFor = "badFeedback" className = "feedback-label">Anything you think could have been better</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-2 mt-lg-0">
              <Control.textarea model = ".badFeedback"
               className = "feedback-input form-control"
               name = "badFeedback"
               id = "badFeedback"
               placeholder = ""
               rows={5}
               />
            </Col>
          </Row>
          <Row className = "form-group align-items-center mt-4">
            <Col xs={12} lg={3} className = "text-left text-lg-right offset-lg-1">
              <Label htmlFor = "gyaan" className = "feedback-label">Aage walon ke liye thoda gyaan peldo<br></br>
              (Shed some light of knowledge)</Label>
            </Col>
            <Col xs={12} lg={7} className = "mt-2 mt-lg-0">
              <Control.textarea model = ".gyaan"
               className = "feedback-input form-control"
               name = "gyaan"
               id = "gyaan"
               placeholder = ""
               rows={5}
               />
            </Col>
          </Row>
          <Row className="form-group my-4">
            <Col xs={12} lg={7} className="offset-lg-4 text-center text-lg-left">
              <Button type="submit" className = "feedback-submit-button">Submit</Button>
            </Col>
          </Row>
        </LocalForm>
      );
    }
    else {
      this.handlelogout();
      return(
        <Redirect to = {'/' + this.props.match.url.split('/')[1] + '/home'} />
      );
    }
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

  render() {
    if(this.state.isLoggedIn) {
      return(
        <div className = "envelope">
          <div className = "container">
            <div className = "row row-contents justify-content-center">
              <div className = "col-11 feedback-box">
                <h1 className = "feedback-heading text-left text-md-center">Review</h1>
                <this.feedbackForm />
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
                  <Button className = "feedback-login-button mt-4 mb-4 mb-md-5" onClick = {() => { this.handleLogin(); }} >Login</Button>
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
