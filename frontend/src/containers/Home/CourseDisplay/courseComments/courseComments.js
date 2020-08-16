import React, {Component} from 'react';
import { Card, CardTitle, CardText, Button, Input, Form, FormGroup } from 'reactstrap';
import axios from 'axios';
import "./courseComments.css";

class RenderComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayReplyform: false,
      replyField: null
    }
    this.matchid = this.matchid.bind(this);
    this.handleReplier = this.handleReplier.bind(this);
  }

  matchid = (author) => {
    return this.props.comment.comment.user === author._id;
  };

  handleReplier = (value) => {
    this.setState({
      displayReplyform: value
    })
  };

  handleReplyChange = (event) => {
    this.setState({
      replyField: event.target.value
    });
  };

  handleReplySubmit = async(event) => {
    event.preventDefault();
    if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      const cookies = document.cookie.split('; ');
      const value = cookies.find(item => item.startsWith('jwt')).split('=')[1];
      console.log(value);
      const response = await axios({
        method: 'post',
        url: '/api/course/' + this.props.courseSlug + "/" + this.props.comment._id + "/reply" ,
        headers: {
          Authorization: `Bearer ${value}`
        },
        data: {
          data: this.state.replyField
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
  };

  render() {
    
    const author = this.props.authorlist.find(this.matchid);
    const authorName = author.name;
    return(
      <div>
        <div className = "col-10 col-md-9 col-lg-8">
          <Card className = "mt-2 mb-1 comment-box">  
            <CardTitle className = "mb-1 mt-1 ml-3 text-left author-name"  >{authorName}</CardTitle>
            <CardText className = "ml-3 mb-2 text-left comment-content">{this.props.comment.comment.data}</CardText>
          </Card>
          <div className = "text-right">
            <Button className="btn btn-link reply-button" onClick = {() => { this.handleReplier(true)} }>Reply</Button>
          </div>
        </div>
        <div className = "col-4" />
        { this.props.comment.comment.replies.map((reply) => {
          function matchreply(author) {
            return reply.user === author._id ;
          }
          const repauthor = this.props.authorlist.find(matchreply);
          const repauthorname = repauthor.name;
          return(
            <div>
              <div className = "col-10 offset-1 col-md-9 col-lg-8">
                <Card className = "mt-2 mb-1 comment-box">  
                  <CardTitle className = "mb-1 mt-1 ml-3 text-left author-name" >{repauthorname}</CardTitle>
                  <CardText className = "ml-3 mr-3 mb-2 text-left comment-content">{reply.data}</CardText>
                </Card>
                <div className = "text-right">
                  <Button className="btn btn-link reply-button" onClick = {() => { this.handleReplier(true)} }>Reply</Button>
                </div>
              </div>
              <div className = "col-1 col-md-2 col-lg-3" />
            </div>
          );
        })}
        { this.state.displayReplyform ? 
          <div>
            <div className = "col-10 offset-1 col-md-9 col-lg-8">
              <Form autoComplete = "off">
                <FormGroup row>
                  <Input type = "text"
                    name = "data"
                    id = "data"
                    placeholder = "post your reply"
                    className = "col-9 col-md-8 col-lg-9 col-xl-9 post-reply-input"
                    onChange = {(event) => { this.handleReplyChange(event) }}
                  />
                  <div className = "col-3 col-md-4 col-lg-3 col-xl-3 d-none d-md-block text-right">
                    <Button onClick = {(event) => { this.handleReplySubmit(event) }} 
                    className = "post-button" 
                    type = "submit">Post reply</Button>
                  </div>
                  <div className = "col-3 d-block d-md-none text-right">
                    <Button onClick = {(event) => { this.handleReplySubmit(event) }} 
                    className = "post-button" 
                    type = "submit">
                      <span className = "fa fa-caret-right"></span>
                      <span className = "fa fa-caret-right"></span>
                    </Button>
                  </div>
                </FormGroup>
              </Form>
            </div>
            <div className = "col-1 col-md-2 col-lg-3" />
          </div>
        : null}
      </div>
    );
  }
}

export default RenderComment;