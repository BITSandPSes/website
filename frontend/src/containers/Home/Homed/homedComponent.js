import React, { Component } from 'react';
import "./homed.css";
import { Link } from 'react-router-dom';
import SearchResults from "react-filter-search";
import axios from 'axios';
import { connect } from 'react-redux';
import * as stationCreators from '../../../store/actions/stations';
import { withRouter } from 'react-router-dom';

class Homed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      all: []
    };
  }

  static getDerivedStateFromProps(nextProps,prevState) {
    if(nextProps.list !== undefined) {
      return {
        all: nextProps.list
      };
    }
  }

  async componentDidUpdate(prevProps) {
    console.log(this.props);
    if(this.props.stationIndex !== window.localStorage.getItem("stationNo")) {
      this.props.fetchList(window.localStorage.getItem("stationNo"));
    }
  }

  async componentDidMount() {
    console.log(this.props);
    if(!this.props.isFetched || (this.props.stationIndex !== window.localStorage.getItem("stationNo"))) {
      this.props.fetchList(window.localStorage.getItem("stationNo"));
    }
  }

  listUpdate = async() => {
    console.log(this.props);
    await this.setState({
      all: this.props.list
    });
    console.log(this.state);
  }

  handleSearchChange = (event) => {
    const { value } = event.target;
    this.setState({ value });
  };

  render() {
    let stationChoice = window.localStorage.getItem("stationNo");
    let color = null;
    if(stationChoice === "1") {
      color = "green";
    }
    else if(stationChoice === "2") {
      color = "blue";
    }
    return(
      <div className = "envelope">
        <div className = "container">
          <div className = "row row-contents justify-content-center">
            <div className = { "col-11 search-box-" + color }>
              <h1 className = "search-heading text-left text-md-center">Search.</h1>
              <h6 className = "search-sub-text text-left text-md-center d-none d-md-block">
              Find the station you are looking for according to the priorities you set.<br />
              Search by name or location, filter according to your preferences.
              </h6>
              <h6 className = "search-sub-text text-left text-md-center d-block d-md-none">
              We will try to find what you are looking for
              </h6>
              <div className = "search-bar-hold">
                <div className = "col-12 col-md-8 offset-md-2 text-left text-md-center padding-remover">
                  <input
                    placeholder="Search for course"
                    type="text"
                    value={this.state.value}
                    onChange={this.handleSearchChange}
                    className = "home-search-bar"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className = "container d-none d-lg-block">
          <div className = "row row-contents justify-content-center align-items-start">
            <div className = "col-4 filter-box">
              <h1 className = "text-left filter-heading">Filters</h1>
              <h3 className = "text-left filter-heading">To be added soon!</h3>
              <br /><br /><br />
            </div>
            <div className = "col-6 offset-1 results-box mb-4">
              <SearchResults
                value={this.state.value}
                data={this.state.all}
                renderResults={results => (
                  <div>
                    {results.map(item => (
                      <Link className="station-linker" to={'/' + window.localStorage.getItem("stationNo") + '/station/' + item.slug} >
                        <div className="my-3 mx-2 station-links">
                          <h5 className={"text-left station-link-header-" + color}>{item.name}</h5>
                          <h6 className="location-station text-left">{"Location: " + item.location}</h6>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
        <div className = "row row-contents d-block d-lg-none">
          <div className = "filter-box-small">
            <h2 className = "filter-heading pt-2">Filters</h2>
            <br/>
            <h5 className = "filter-heading">To be added soon!</h5>
            <br />
          </div>
        </div>
        <div className = "container">
          <div className = "justify-content-center row row-contents d-flex d-lg-none">
            <div className = "col-11 results-box mb-4 ">
            <SearchResults
                value={this.state.value}
                data={this.state.all}
                renderResults={results => (
                  <div>
                    {results.map(item => (
                      <Link className="station-linker" to={'/' + window.localStorage.getItem("stationNo") + '/station/' + item.slug} >
                        <div className="my-3 mx-2 station-links">
                          <h5 className={"text-left station-link-header-" + color}>{item.name}</h5>
                          <h6 className="location-station text-left">{"Location: " + item.location}</h6>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const mapDispatchtoProps = (dispatch) => {
  return {
    fetchList: (index) => dispatch(stationCreators.stationFetch(index))
  }
}

export default connect(null, mapDispatchtoProps)(withRouter(Homed));