import React, { Component } from 'react';
import './stationDisplay.css';
import NotFound from '../../NotFound/notfoundComponent';
import { FormGroup, Form, Input, Button} from 'reactstrap';
import axios from 'axios';
import RenderComment from './renderCommentsComponent/renderComments';
import { withRouter } from 'react-router-dom';
import SearchBar from '../SearchNavbar/searchNavComponent';
import baseUrl from '../../../baseUrl';

function RenderComments ({list, authorlist, stationName}) {
  if(!list || list.length === 0) {
    return(
      <div className = "col-12">
        <h4 className = "p-4 no-comment">No comments</h4>
      </div>
    );
  }
  
  console.log(list);
  console.log(authorlist);

  if( !authorlist || authorlist.length === 0) {
    return(
      <div />
    );
  }

  else {
    return(
      <div className = "col-12 pt-1">
        { list.map((comment) => {
          return(
            <RenderComment 
            key = {comment._id} 
            comment = {comment} 
            authorlist = {authorlist}
            stationName = {stationName} />
          );
        })}    
      </div>
    );
  }
};

class StationDisplay extends Component {
  constructor(props) {
    super(props);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    this.state = {
      stationDetails: {
        station: {
          name: null,
          discussion: []
        },
        users: []
      },
      stationFound: true,
      commentField: null
    }
  }
  
  async componentDidMount() {
    const query = this.props.match.params.stationName;
    try {
      const response = await fetch( baseUrl + '/api/' + window.localStorage.getItem("stationNo") + '/' + query);
      if(response.ok) {
        const json = await response.json();
        this.setState({
          stationDetails: json,
          stationFound: true
        });
      }
      else if(response.status === 404) {
        this.setState({
          stationFound: false
        })
      }
      else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        this.setState({
          stationFound: false
        });
        throw error;
      }
    } catch(error) {
      alert("could not fetch Station Details.\nError: "+ error.message);
    }
  }

  handleCommentChange = (event) => {
    this.setState({
      commentField: event.target.value
    });
    console.log(this.state.commentField);
  };

  handleCommentSubmit = async e => {
    e.preventDefault();
    if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      const cookies = document.cookie.split('; ');
      const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];
      console.log(value);
      const response = await axios({
        method: 'post',
        url: "/api/" + window.localStorage.getItem("stationNo") + '/' + this.props.match.params.stationName + "/comment" ,
        headers: {
          Authorization: `Bearer ${value}`
        },
        data: {
          data: this.state.commentField
        }
      });
      if(response.status === 200) {
        window.location.reload();
      }
      else {
        alert('Error ' + response.status + ': ' + response.statusText);
      }
    }
    else {
      alert("you must be logged in to comment on stations.");
    }
  }

  render() {
    console.log(this.props);
    console.log(this.state.stationDetails.users);
    let stationChoice = window.localStorage.getItem("stationNo");
    let color = null;
    if(stationChoice === "1") {
      color = "green";
    }
    else if(stationChoice === "2") {
      color = "blue";
    }
    if(this.state.stationFound === true) {
      return(
        <div className = "envelope-sd">
          <SearchBar color = {color}/>
          <div className = "container">
            <div className = "col-12 text-center pt-5">
              <h1 className = { "py-2 station-heading-" + color }>{this.state.stationDetails.station.name}<h5 className = "location-heading pt-1">{this.state.stationDetails.station.location}</h5></h1>
            </div>
            <div className = "col-12" >
              <h3 className = "col-12 sub-heading">CGPA cutoffs for respective campuses</h3>
              <div className = "row mt-3">
                <h3 className = "col-12 text-center"><br /><br/>To be added soon<br/><br/></h3>
              </div>
            </div>
            <div className = "col-12">
              <h3 className = "col-12 sub-heading">Discussion</h3>
              <div className = "discussion-container">
                <RenderComments list = {this.state.stationDetails.station.discussion} 
                authorlist = {this.state.stationDetails.users}
                stationName = {this.props.match.params.stationName} />
                <div class = "col-12 commenter">
                  <Form autoComplete = "off" className = "col-12">
                    <FormGroup row>
                      <Input type = "text"
                      name = "data"
                      id = "data"
                      className = "col-9 col-md-8 col-lg-9 col-xl-10 post-comment-input"
                      placeholder = "Write comment"
                      onChange = {(event) => {this.handleCommentChange(event) }}>
                      </Input>
                      <div className = "col-4 col-lg-3 col-xl-2 d-none d-md-block text-right">
                        <Button onClick = {(event) =>{this.handleCommentSubmit(event)}} type = "submit" className = { "post-button-" + color }>Post Comment</Button>
                      </div>
                      <div className = "col-3 d-block d-md-none text-right">
                        <Button onClick = {(event) =>{this.handleCommentSubmit(event)}} type = "submit" className = { " post-button-" + color }>
                          <span className = "fa fa-caret-right"></span>
                          <span className = "fa fa-caret-right"></span>
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
    }
    else {
      return(
        <NotFound />
      );
    }
  };
};

export default withRouter(StationDisplay);