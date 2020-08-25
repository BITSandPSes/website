import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Label } from 'reactstrap';
import "./homed.css";
import { Link } from 'react-router-dom';
import baseUrl from '../../../baseUrl';
import axios from 'axios';

function ListDisplay ({list,title,color}) {
  console.log(list);
  if(list === null) {
    return(
      <div />
    );
  }
  else {
    return(
      <div>
        <h1 className = { "result-title-" + color }>{title}</h1>
        <ul className = "list-unstyled">
          { list.map((item) => {
              return(
                <li>
                  <Link className = "station-linker" to = { '/' + window.localStorage.getItem("stationNo") + '/station/' + item.slug} >
                    <div className = "my-3 mx-2 station-links">
                      <h5 className = { "text-left station-link-header-" + color }>{item.name}</h5>
                      <h6 className = "location-station text-left">{"Location: " + item.location}</h6>
                    </div>
                  </Link>
                </li>
              );
          })}
        </ul>
      </div>
    );
  }
}

class Homed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: null,
      errMessage: "",
      foundResults: false,
      resultsLoading: false,
      searchField: "",
      resultTitle: "All Stations",
      stationsDisplayed: 0,
      shouldLoadMore: true,
      searchMethod: "name"
    };
    this.cancel = '';
  }
  
  componentDidUpdate(prevProps) {
    if(prevProps.location.key !== this.props.location.key) {
      this.fetchSearchResults(0,"","name");
    }
  }

  fetchSearchResults = async(skip,query,searchMethod) => {
    const limitskipper = `&limit=10&skip=${skip}`;
    let queryfeeder = "";
    if( query !== "" || query !== null ) {
      queryfeeder = searchMethod + '=' + query;
    }
    const fetchUrl = baseUrl + '/api/' + window.localStorage.getItem("stationNo") + '?' + queryfeeder + limitskipper;
    if(this.cancel) {
      //cancel the previous request before making a new one
      this.cancel.cancel();
    }
    //creating a new cancel token
    this.cancel = axios.CancelToken.source();
    
    axios.get( fetchUrl, {
      cancelToken: this.cancel.token 
    })
    .then((response) => {
      let results;
      if(skip === 0) {
        results = response.data;
      }
      else {
        results = [...this.state.searchData,...response.data] ;
      }
      this.setState({
        searchData: results,
        resultTitle: "Search Results",
        stationsDisplayed: this.state.stationsDisplayed + response.data.length,
        shouldLoadMore: ( response.data.length === 10 ),
        searchMethod: searchMethod,
        resultsLoading: false 
      });
    })
    .catch((error) =>{
      if( axios.isCancel(error) || error ) {
        this.setState({
          resultsLoading: false,
          errMessage: 'Failed to fetch'
        });
      }
    });
  }

  async componentDidMount() {
    console.log(this.props);
    const query = this.state.searchField;
    const searchMethod = this.state.searchMethod;
    this.fetchSearchResults(0,query,searchMethod);
  }

  changeSearchMethod = (changeEvent) => {
    const query = this.state.searchField;
    const searchMethod = changeEvent.target.value;
    this.setState({
      searchMethod: changeEvent.target.value,
      searchField: query,
      resultsLoading: true,
      errMessage: ""
    }, () => {
      this.fetchSearchResults(0,query,searchMethod);
    });
  }

  handleSearchChange = (event) => {
    const query = event.target.value;
    const searchMethod = this.state.searchMethod;
    this.setState({
      searchField: query,
      resultsLoading: true,
      errMessage: ""
    }, () => {
      this.fetchSearchResults(0,query,searchMethod);
    });
  }

  handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = this.state.searchField;
    const searchMethod = this.state.searchMethod;
    this.setState({
      searchField: event.target.value,
      resultsLoading: true,
      errMessage: ""
    }, () => {
      this.fetchSearchResults(0,query,searchMethod);
    });
  }

  loadMore = async() => {
    var x = window.scrollX;
    var y = window.scrollY;
    const query = this.state.searchField;
    const searchMethod = this.state.searchMethod;
    this.fetchSearchResults(this.state.stationsDisplayed,query,searchMethod);
    window.scrollTo(x,y);
  }

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
                <Form className = "row " autoComplete = "off">
                  <div className = "col-12 col-md-8 offset-md-2 text-left text-md-center padding-remover">
                  <Input type = "text"
                    name = "Search"
                    defaultValue = { this.state.searchField !== "" ? this.state.searchField : null } 
                    placeholder = "Search"
                    className = "home-search-bar"
                    onChange = { (event) => {this.handleSearchChange(event)}} />
                  </div>
                  <div className = "col-6 col-md-4 offset-md-2 text-left text-md-left padding-remover">
                    <FormGroup check inline className = "mt-4">
                      <Label check className = "label-font">
                        <Input type = "radio" 
                         name = "searchMethod" 
                         value = "name" 
                         checked = { this.state.searchMethod === "name" }
                         onChange = { this.changeSearchMethod } /> By Name
                      </Label>
                    </FormGroup>
                    <FormGroup check inline className = "mt-4">
                      <Label check className = "label-font">
                        <Input type = "radio" 
                         name = "searchMethod"
                         value = "location" 
                         checked = { this.state.searchMethod === "location" }
                         onChange = { this.changeSearchMethod } /> By Location
                      </Label>
                    </FormGroup>
                  </div>
                  <div className = "col-6 col-md-4 text-right text-md-right padding-remover">
                    <Button className = "search-button mt-4 ml-md-3" onClick = {(event) => { this.handleSearchSubmit(event) }} type = "submit" >Search</Button>
                  </div>
                </Form>
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
              <div>
                <ListDisplay 
                 list = {this.state.searchData} 
                 title = {this.state.resultTitle} 
                 color = {color}
                />
              </div>
              { this.state.shouldLoadMore ? 
                <Button color = "link outline-none" onClick = { this.loadMore } className = "btn mb-1 load-more"><h5>LOAD MORE</h5></Button> 
              : null}
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
            <div className = "col-11 results-box mb-4">
              <div>
                <ListDisplay 
                  list = {this.state.searchData} 
                  title = {this.state.resultTitle} 
                  color = {color}
                />
              </div>
              { this.state.errMessage && <p className = "message">{this.state.errMessage}</p> }
              { this.state.resultsLoading && <p className = "message">Loading...</p> }
              { this.state.shouldLoadMore ? 
                <Button color = "link outline-none" onClick = { this.loadMore } className = "btn mb-1 load-more"><h5>LOAD MORE</h5></Button> 
              : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Homed;