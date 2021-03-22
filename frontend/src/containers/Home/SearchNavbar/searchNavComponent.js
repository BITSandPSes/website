import React, { Component } from 'react';
import { FormGroup, Input, Button, Row } from 'reactstrap';
import "./searchNav.css";
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
      const { data } = await axios('/api/' + window.localStorage.getItem("stationNo"));

      const options = [];
      data.forEach(station => {
        options.push({
          value: station.slug,
          label: station.name + ' ' + station.location
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
    return(
      <div className = "row row-search align-items-center fixed-top envelope zer">
        <div className = "col-10 offset-1 col-md-8 offset-md-2 justify-content-center">
          <Search key={this.state.options} options={this.state.options} loc={'/' + window.localStorage.getItem('stationNo') +'/station/'} />
        </div>
      </div>
    );
  }
};

export default SearchBar;