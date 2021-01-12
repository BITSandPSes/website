import { Button, Row, Col, Label } from 'reactstrap';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../../baseUrl';
import authUrl from '../../../authRedirect';
import { LocalForm, actions, Control, Errors } from 'react-redux-form';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './feedback.css';
import huelList from '../../../courses';
import SearchRecc from './searchreccComponent/searchReccComponent';

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.feedbackForm = this.feedbackForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInterestChange = this.onInterestChange.bind(this);
    this.state = {
      isLoggedIn: false,
      submitMore: true,
      noOfFeedbacks: 0,
      pr: '',
      interestValue: 3,
      liteValue: 3,
      gradingValue: 3,
      anotherWindow: false,
      course: {
        courseName: "",
        courseNo: "",
        courseSlug: ""
      },
      matchList: [],
      matchesSomeCourse: false,
      showNameRec: false,
      showNoRec: false
    }
  }

  // static getDerivedStateFromProps() {
  //   if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
  //     return {
  //       isLoggedIn: true
  //     };
  //   }
  //   return null;
  // }

  async handleSubmit(values) {
    console.log(values);
    if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) { //checking whether client has logged in 
      const cookies = document.cookie.split('; ');
      const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];  //extracting bearer token from login cookie
      if( this.state.matchesSomeCourse ) {
        try{
            let response = await axios({     //posting the comment request on backend
            method: 'post',
            url: baseUrl +  "/api/course/feedback" ,
            headers: {
              Authorization: `Bearer ${value}`
            },
            data: {
              "course": this.state.course.courseSlug,
              "pr": this.state.pr,
              "ratings": {
                "experience": this.state.interestValue,
                "lite": this.state.liteValue,
                "grade": this.state.gradingValue,
              },
              "feedbacks": {
                "good": values.goodFeedback,
                "bad": values.badFeedback,
                "other": values.gyaan
              } 
            }
          });
          if(response.status === 200) {
            this.setState({
              anotherWindow: true
            });
          }
        }
        catch(error) {
          alert(error.response.data);
        }
      }
      else {
        alert("Properly fill the course information");
      }
    }
    else {             //if client has not logged in
      alert("you must be logged in to comment on stations.");
    }
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

  handlePrChange = (e) => {
    this.setState({
      pr: e.target.value
    });
  }

  handleNameChange = (e) => {
    console.log(e.target.value);
    this.setState({
      matchList: huelList.filter((course) => course.courseName.includes(e.target.value.toUpperCase())),
      course: {
        courseName: e.target.value,
        courseNo: "",
        courseSlug: ""
      }
    });
    console.log(this.state.matchList);
    console.log(e.target.value.toUpperCase() === "MASS MEDIA & CONTENT DES");
    if(this.state.matchList.some((course) => course.courseName == e.target.value.toUpperCase())) {
      this.setState({
        matchesSomeCourse: true,
        course: this.state.matchList.find((course) => course.courseName == e.target.value.toUpperCase())
      }, function() {
        console.log(this.state.matchesSomeCourse);
      });
    }
    else {
      this.setState({
        matchesSomeCourse: false
      }, function() {
        console.log(this.state.matchesSomeCourse);
      });
    }
    
  }

  handleNumberChange = (e) => {
    console.log(e.target.value);
    this.setState({
      matchList: huelList.filter( (course) => course.courseNo.includes(e.target.value.toUpperCase()) ),
      course: {
        courseName: "",
        courseNo: e.target.value,
        courseSlug: ""
      }
    });
    console.log(this.state.matchList);
    if(this.state.matchList.some((course) => course.courseNo == e.target.value.toUpperCase())) {
      this.setState({
        matchesSomeCourse: true,
        course: this.state.matchList.find((course) => course.courseNo == e.target.value.toUpperCase())
      }, function() {
        console.log(this.state.matchesSomeCourse);
      });
    }
    else {
      this.setState({
        matchesSomeCourse: false
      }, function() {
        console.log(this.state.matchesSomeCourse);
      });
    }
  }

  handleAutoFill = (contra) => {
    this.setState({
      course: contra,
      matchesSomeCourse: true,
      showNameRec: false,
      showNoRec: false,
      matchList: [contra]
    }, function() {
      console.log(this.state.matchesSomeCourse);
    });
    console.log(this.state.matchList);
  }


  feedbackForm = () => {
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
              placeholder = "Name of HuEl"
              onChange = {this.handleNameChange}
              value = {this.state.course.courseName}
              onFocus = { () => { this.setState({ showNameRec: true, showNoRec: false }); } } 
              autoComplete = "off"
              />
            <SearchRecc
              list = {this.state.matchList} 
              click = {this.handleAutoFill}
              display = {1}
              show = {this.state.showNameRec} />
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
              placeholder = "Course number of Huel"
              onChange = {this.handleNumberChange}
              value = {this.state.course.courseNo}
              onFocus = { () => { this.setState({ showNoRec: true, showNameRec: false }); }}
              autoComplete = "off"
              />
            <SearchRecc
              list = {this.state.matchList} 
              click = {this.handleAutoFill} 
              display = {2}
              show = {this.state.showNoRec}/>
          </Col>
        </Row>
        <Row className = "form-group align-items-end mt-4">
          <Col xs={12} lg={3} className = "text-left text-lg-right offset-lg-1">
            <Label htmlFor = "pr" className = "feedback-label mr-lg-0">Your PR number last sem</Label>
          </Col>
          <Col xs={12} lg={7} className = "mt-2 mt-lg-0">
            <Control.text model = ".prNo"
              className = "feedback-input form-control"
              name = "pr"
              id = "pr"
              placeholder = "Will be used to provide availability range"
              onChange = {this.handlePrChange}
              value = {this.state.pr}
              onFocus = { () => { this.setState({ showNameRec: false, showNoRec: false }); } } 
              autoComplete = "off"
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
              onFocus = { () => { this.setState({ showNameRec: false, showNoRec: false }); } }
              />     
          </Col>
        </Row>
        <Row className = "form-group align-items-start mt-4">
          <Col xs={12} lg={4} className = "text-left text-lg-right">
            <Label htmlFor = "experience" className = "feedback-black-label">How lite was the course structure ? Rate its Liteness
            while preparing for exams. (1-5) 5 if ulta lite.</Label>
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
              onFocus = { () => { this.setState({ showNameRec: false, showNoRec: false }); } }
              />     
          </Col>
        </Row>
        <Row className = "form-group align-items-start mt-4">
          <Col xs={12} lg={4} className = "text-left text-lg-right">
            <Label htmlFor = "experience" className = "feedback-black-label">How lenient was the grading scheme? Rate 1
            if very strict(lower C at average) and 5 if extremely lenient.</Label>
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
              onFocus = { () => { this.setState({ showNameRec: false, showNoRec: false }); } }
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
              onFocus = { () => { this.setState({ showNameRec: false, showNoRec: false }); } }
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
              onFocus = { () => { this.setState({ showNameRec: false, showNoRec: false }); } }
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
              onFocus = { () => { this.setState({ showNameRec: false, showNoRec: false }); } }
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

  render() {
    if(this.state.anotherWindow) {
      return(
        <div className = "envelope">
          <div className = "container">
            <div className = "row row-contents justify-content-center">
              <div className = "col-11 feedback-box">
                <h1 className = "feedback-heading text-left text-md-center">Thanks.</h1>
                <h6 className = "feedback-sub-text text-left text-md-center d-block">
                  We are grateful for your valuable feedback peepeepoopoo..
                </h6>
                <Button className = "feedback-login-button mt-4 mb-4 mb-md-5" 
                onClick = {() => { window.location.reload(); }} >Submit another review
                </Button>
                {/* <br/> */}
                {/* <Button className = "feedback-login-button mt-4 mb-4 mb-md-5" onClick = {() => { this.handlelogout(); window.location.reload(); }} >Logout</Button> */}
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      if(this.props.loggedIn) {
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
                  <a href = { authUrl + "&state=/3/feedback"}>
                    <Button className = "feedback-login-button mt-4 mb-4 mb-md-5">Login</Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

}

export default Feedback;
