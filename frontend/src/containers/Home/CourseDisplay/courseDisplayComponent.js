import React, { Component } from "react";
import "./courseDisplay.css";
import NotFound from "../../NotFound/notfoundComponent";
import { FormGroup, Form, Input, Button } from "reactstrap";
import axios from "axios";
import RenderComment from "./courseComments/courseComments"; //component to display each comment with its replies
import { withRouter } from "react-router-dom";
import SearchBar from "../searchCourseNav/searchCourseNavComponent"; //component that allows to search right from course page
import baseUrl from "../../../baseUrl"; //for directing requests to backend

function RenderComments({ list, authorlist, courseSlug }) {
  //to render all comments in discussion container
  if (!list || list.length === 0) {
    return (
      <div className="col-12">
        <h4 className="p-4 no-comment">No comments</h4>
      </div>
    );
  }

  console.log(list);
  console.log(authorlist);

  if (!authorlist || authorlist.length === 0) {
    return <div />;
  } else {
    return (
      <div className="col-12 pt-1">
        {list.map((comment) => {
          return (
            <RenderComment //component to display each comment with its replies
              key={comment._id}
              comment={comment}
              authorlist={authorlist}
              courseSlug={courseSlug}
            />
          );
        })}
      </div>
    );
  }
}

class CourseDisplay extends Component {
  constructor(props) {
    super(props);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.state = {
      courseDetails: {
        //structure defined here to prevent initial callback failure
        course: {
          //promise updates and fills this object
          title: null,
          discussion: [],
        },
        users: [],
      },
      courseFound: true, //boolean to store whether courseSlug in url is found or not
      commentField: null, //stores and updates comment typed by the user after every change
      courseDesc: {
        //stores all course data fetched from timetable api
        lectures: [], //structure defined here to prevent initial callback failure
      },
    };
  }

  async componentDidMount() {
    const query = this.props.match.params.courseSlug; //extracting courseSlug from url
    try {
      const response = await fetch(baseUrl + "/api/course/" + query); //fetching all the course details thru backend
      if (response.ok) {
        const json = await response.json();
        console.log(json);
        this.setState({
          courseDetails: json, //updating courseDetails
          courseFound: true,
        });
      } else if (response.status === 404) {
        this.setState({
          courseFound: false, //redirects to not found component on re-render
        });
      } else {
        var error = new Error(
          "Error " + response.status + ": " + response.statusText
        );
        error.response = response;
        this.setState({
          courseFound: false,
        });
        throw error;
      }

      //course details from timetable api are fetched
      const fresponse = await fetch(
        "https://timetablevisualiser-api.herokuapp.com/CourseData?course_number=" +
          this.state.courseDetails.course.number
      );
      if (fresponse.ok) {
        const json = await fresponse.json();
        console.log(json);
        this.setState({
          courseDesc: json, //updates courseDesc
        });
      } else if (fresponse.status === 404) {
        this.setState({
          courseFound: false, //redirects to not found component on re-render
        });
      } else {
        var error = new Error(
          "Error " + response.status + ": " + response.statusText
        );
        error.response = response;
        this.setState({
          courseFound: false,
        });
        throw error;
      }
    } catch (error) {
      alert("could not fetch course Details.\nError: " + error.message);
    }
  }

  handleCommentChange = (event) => {
    //on every change in input ,this is triggered to store the updated comment in state
    this.setState({
      commentField: event.target.value,
    });
  };

  handleCommentSubmit = async (e) => {
    //triggers every time client hits "post Comment"
    e.preventDefault();
    if (
      document.cookie.split(";").some((item) => item.trim().startsWith("jwt="))
    ) {
      //checking whether client has logged in
      const cookies = document.cookie.split("; ");
      const value = cookies
        .find((item) => item.startsWith("jwt"))
        .split("=")[1]; //extracting bearer token from login cookie
      console.log(value);
      const response = await axios({
        //posting the comment request on backend
        method: "post",
        url: "/api/course/" + this.props.match.params.courseSlug + "/comment",
        headers: {
          Authorization: `Bearer ${value}`,
        },
        data: {
          data: this.state.commentField,
        },
      });
      if (response.status === 200) {
        window.location.reload(); //reload tha page to show new updated comment
      } else {
        alert("Error " + response.status + ": " + response.statusText);
      }
    } else {
      //if client has not logged in
      alert("you must be logged in to comment on stations.");
    }
  };

  render() {
    window.localStorage.setItem("stationNo", "3");
    if (this.state.courseFound === true) {
      //check if course has been found (true default value so that notfound isnt shown while page reloads)
      let professors = [];
      this.state.courseDesc.lectures.forEach((section) => {
        //finding all unique profs currently taking the course
        let counter = 3;
        const substrings = section.split(",");
        while (counter < substrings.length) {
          professors.push(substrings[counter]);
          counter++;
        }
      });
      let uniprofs = [...new Set(professors)]; //removes repetition of same names from array
      let uniprofstring = "";
      let count = 0;
      while (count < uniprofs.length) {
        //creating string for display from professors array
        if (count !== 0) {
          uniprofstring = uniprofstring + ", ";
        }
        uniprofstring = uniprofstring + uniprofs[count];
        count++;
      }
      return (
        <div className="envelope-sd">
          <SearchBar />
          <div className="container">
            <div className="col-12 text-center pt-5">
              <h1 className="py-2 course-heading">
                {this.state.courseDetails.course.title}
                <h5 className="location-heading pt-1">
                  {this.state.courseDetails.course.number}
                </h5>
              </h1>
            </div>
            <div className="col-12 text-left mb-3 mt-3">
              <div className="course-description p-2">
                <span className="description-header display-inline-block">
                  Instructor in-charge:&nbsp;
                </span>
                <span className="description-body display-inline-block">
                  {this.state.courseDesc.ic}
                </span>
                <br />
                <span className="description-header">Professors:&nbsp;</span>
                <span className="description-body">{uniprofstring}</span>
                <br />
                <span className="description-header">
                  No of credits on completion:&nbsp;
                </span>
                <span className="description-body">
                  {this.state.courseDesc.credits}
                </span>
                <br />
                <span className="description-header">Description:&nbsp;</span>
                <span className="description-body"></span>
                <br />
              </div>
            </div>
            <div className="col-12">
              <h3 className="col-12 sub-heading">Resources</h3>
            </div>
            <div className="col-12">
              <h3 className="col-12 sub-heading">Discussion</h3>
              <div className="discussion-container">
                <RenderComments
                  list={this.state.courseDetails.course.discussion}
                  authorlist={this.state.courseDetails.users}
                  courseSlug={this.props.match.params.courseSlug}
                />
                <div class="col-12 commenter">
                  <Form autoComplete="off" className="col-12">
                    <FormGroup row>
                      <Input
                        type="text"
                        name="data"
                        id="data"
                        className="col-9 col-md-8 col-lg-9 col-xl-10 post-comment-input"
                        placeholder="Write comment"
                        onChange={(event) => {
                          this.handleCommentChange(event);
                        }}
                      ></Input>
                      <div className="col-4 col-lg-3 col-xl-2 d-none d-md-block text-right">
                        <Button
                          onClick={(event) => {
                            this.handleCommentSubmit(event);
                          }}
                          type="submit"
                          className="post-button"
                        >
                          Post Comment
                        </Button>
                      </div>
                      <div className="col-3 d-block d-md-none text-right">
                        <Button
                          onClick={(event) => {
                            this.handleCommentSubmit(event);
                          }}
                          type="submit"
                          className="post-button"
                        >
                          <span className="fa fa-caret-right"></span>
                          <span className="fa fa-caret-right"></span>
                        </Button>
                      </div>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <NotFound />;
    }
  }
}

export default withRouter(CourseDisplay);
