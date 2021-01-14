import React, { Component } from 'react';
import "./huelCombine.css";
import axios from 'axios';
import { Link } from 'react-router-dom';

function RenderList ({list}) {
  if(!list || list.length === 0) {
    return(
      <div/>
    );
  }
  else {
    return(
      <table className = "huel-table mt-3">
        <tr>
          <th>Rank</th>
          <th className = "text-left">Course Name</th>
          <th className = "text-left">Course No.</th>
          <th>No. of feedbacks</th>
        </tr>
        {list.map((course, index) => {
          return(
            <tr>
              <td className = "text-left ">{index + 1}</td>
              <td className = "text-left "><Link className = "huel-table-link"  to = { '/3/course/' + course.slug }>{course.title}</Link></td>
              <td className = "text-left "><Link className = "huel-table-link" to = { '/3/course/' + course.slug }>{course.number}</Link></td>
              <td>{course.feedbacks}</td>
            </tr>
          );
        })}
      </table>
    );
  }
}

class HuelCombine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popularList: []
    }
  }

  async componentDidMount() {
    try{
      const response = await axios({
        method: 'get',
        url: "/api/huels"
      });
      if(response.status === 200) {
        this.setState({
          popularList: response.data
        });
      }
      else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);
        error.response = response;
        throw error;
      }
    }
    catch(error) {
      alert("Could not fetch huels list. Error: "+ error.message);
    }
  }
  
  render() {
    return(
      <div className = 'envelope'>
        <div className = 'container'>    
          <div className = 'row'>
            <div className = 'col-12 list-column'>  
              <RenderList list = {this.state.popularList}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HuelCombine;