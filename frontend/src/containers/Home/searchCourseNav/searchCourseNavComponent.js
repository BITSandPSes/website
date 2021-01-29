import React, { Component } from 'react';
import "./searchCourseNav.css";
import Search from '../search/search'
import axios from 'axios';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: []
    }
  }

  async componentDidMount() {
    try {
      const { data } = await axios('/api/course');

      const options = [];
      data.forEach(course => {
        options.push({
          value: course.slug,
          label: course.number + ' ' + course.title
        })
      });

      this.setState({
        options: options
      });
    } catch (error) {
      alert("could not fetch search results.\nError: " + error.message);
    }
  }

  render() {
    return (
      <div className="row row-search align-items-center fixed-top envelope zerk">
        <div className="col-10 offset-1 col-md-8 offset-md-2 justify-content-center">
          <Search key={this.state.options} options={this.state.options} loc={'/3/course/'} />
        </div>
      </div>
    );
  }
};

export default SearchBar;