import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Label } from 'reactstrap';
import "./elecHomed.css";
import { Link } from 'react-router-dom';
import CheckBox from './checkBoxComponent';
import baseUrl from '../../../baseUrl';
import { CSSTransition } from 'react-transition-group';

function ListDisplay ({list,title}) {
  console.log(list);
  if(list === null) {
    return(
      <div />
    );
  }
  else {
    return(
      <div>
        <h1 className = { "elec-result-title"}>{title}</h1>
        <ul className = "list-unstyled">
          { list.map((item) => {
              return(
                <li>
                  <Link className = "station-linker" to = { '/' + window.localStorage.getItem("stationNo") + '/course/' + item.slug} >
                    <div className = "my-3 mx-2 station-links">
                      <h5 className = { "text-left elec-station-link-header" }>{item.title}</h5>
                      <h6 className = "location-station text-left">{"Number: " + item.number}</h6>
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

class CourseDisplay extends Component {
  constructor(props) {
    window.localStorage.setItem("stationNo","3")
    super(props);
    this.findplaceholder = this.findplaceholder.bind(this);
    this.handleEmptytype = this.handleEmptytype.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      searchData: null,
      foundResults: false,
      topData: null,
      searchField: "",
      resultTitle: "All Courses",
      stationsDisplayed: 0,
      shouldLoadMore: true,
      allCheck: true,
      courses: [
        { id: 1, value: "BITS", name: "General", isChecked: false},
        { id: 2, value: "BIO", name: "Biology", isChecked: false },
        { id: 3, value: "CE", name: "Civil", isChecked: false },
        { id: 4, value: "CHE", name: "Chemical", isChecked: false },
        { id: 5, value: "CHEM", name: "Chemistry", isChecked: false },
        { id: 6, value: "CS", name: "Computer Science", isChecked: false },
        { id: 7, value: "ECON", name: "Economics", isChecked: false },
        { id: 8, value: "EEE", name: "Electrical & Electronics", isChecked: false },
        { id: 9, value: "GS|\bHSS", name: "Humanities", isChecked: false },
        { id: 10, value: "INSTR", name: "Instrumentation", isChecked: false },
        { id: 12, value: "MATH", name: "Mathematics", isChecked: false },
        { id: 13, value: "MBA", name: "MBA", isChecked: false },
        { id: 14, value: "ME", name: "Mechanical", isChecked: false },
        { id: 15, value: "MF", name: "Manufacturing", isChecked: false },
        { id: 16, value: "PHA", name: "Pharmacy", isChecked: false },
        { id: 17, value: "PHY", name: "Physics", isChecked: false },
      ],
      searchMethod: "title",
      isfilterOpen: false
    }
  }
  
  componentDidUpdate(prevProps) {
    if(prevProps.location.key !== this.props.location.key) {
      window.location.reload(false);
    }
  }

  async componentDidMount() {
    let courses = this.state.courses;
    let allCheck;
    window.sessionStorage.getItem("allCheck") === "0" ? allCheck = false : allCheck = true; 
    courses.forEach((course) => {
      if(window.sessionStorage.getItem(course.name) === "0") {
        course.isChecked = false;    
      }
      else {
        course.isChecked = true;
      }
    });
    this.setState({
      courses: courses,
      allCheck: allCheck
    });
    console.log(this.props);
    try {
      if(this.props.location.search !== "") {
        const query = this.props.location.search.split("=")[1].split("&")[0];
        const sender = this.props.location.search.split("=")[2];
        const response = await fetch( baseUrl + '/api/course?' + sender + '=' + query + '&limit=10&skip=' + this.state.stationsDisplayed );
        if(response.ok)
        {
          const json = await response.json();
          this.setState({
            searchData: json,
            resultTitle: "Search Courses",
            stationsDisplayed: this.state.stationsDisplayed + json.length,
            shouldLoadMore: ( json.length === 10 ),
            searchMethod: sender
          });
        }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      } else {
        let query = "(";
        let counter = 0;
        this.state.courses.forEach((course) => {
          if(course.isChecked) {
            if(counter === 0) {
              query = query + '\\b' + course.value; 
            }
            else {
              query = query + '|\\b' + course.value;
            }
            counter++;
          }
        });
        query = query + ')';
        const response = await fetch( baseUrl + '/api/course?number=' + query + '&limit=10&skip=' + this.state.stationsDisplayed );
        if(response.ok)
        {
          const json = await response.json();
          this.setState({
            searchData: json,
            stationsDisplayed: this.state.stationsDisplayed + json.length,
            shouldLoadMore: ( json.length === 10 ),
            searchMethod: "number"
          });
        }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      }
    } catch(error) {
      alert("could not fetch search results.\nError: "+ error.message);
    }
  }

  handleFilters = (event) => {
    event.preventDefault();
  }

  togglefiltersmall = () => {
    this.setState({
      isfilterOpen: !this.state.isfilterOpen
    });
  }

  toggleCheck = (event) => {
    let courses = this.state.courses;
    if(event.target.checked) {
      window.sessionStorage.setItem("allCheck","1");
      this.setState({
        allCheck: true
      });
    }
    else {
      window.sessionStorage.setItem("allCheck","0");
      this.setState({
        allCheck: false
      })
    }
    courses.forEach((course) => {
      course.isChecked = event.target.checked
      if(course.isChecked) {
        window.sessionStorage.setItem(course.name,"1");
      }
      else {
        window.sessionStorage.setItem(course.name,"0");
      }
    });
    this.setState({
      courses: courses
    });
  }

  handleCheckChild = (event) => {
    let courses = this.state.courses;
    courses.forEach((course) => {
      if(event.target.value === course.value) {
        course.isChecked = event.target.checked
        if(course.isChecked) {
          window.sessionStorage.setItem(course.name,"1");
        }
        else {
          window.sessionStorage.setItem(course.name,"0");
        }
      }
    });
    this.setState({
      courses: courses      
    });
  }
  
  changeSearchMethod = (changeEvent) => {
    this.setState({
      searchMethod: changeEvent.target.value
    });
  }

  findplaceholder = () => {
    if( this.props.location.search !== "") {
      return this.props.location.search.split("=")[1].split("&")[0];
    }
    else {
      return null;
    }
  };

  handleEmptytype = (event) => {
    if(this.state.searchField === null || this.state.searchField === "") {
      event.preventDefault();
    }
  }

  storeSearch = (event) => {
    this.setState({
      searchField: event.target.value
    });
  }

  loadMore = async(event) => {
    var x = window.scrollX;
    var y = window.scrollY;
    try {
      if(this.props.location.search !== "") {
        const query = this.props.location.search.split("=")[1].split("&")[0];
        const sender = this.props.location.search.split("=")[2];
        const response = await fetch( baseUrl + '/api/course?' + sender + '=' + query + '&limit=10&skip=' + this.state.stationsDisplayed );
        if(response.ok)
        {
          const json = await response.json();
          this.setState({
            searchData: [...this.state.searchData,...json],
            resultTitle: "Searched Courses",
            stationsDisplayed: this.state.stationsDisplayed + json.length,
            shouldLoadMore: ( json.length === 10 )
          });
        }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      } else {
        let query = "(";
        let counter = 0;
        this.state.courses.forEach((course) => {
          if(course.isChecked) {
            if(counter === 0) {
              query = query + '\\b' + course.value; 
            }
            else {
              query = query + '|\\b' + course.value;
            }
            counter++;
          }
        });
        query = query + ')';
        const response = await fetch( baseUrl + '/api/course?number=' + query + '&limit=10&skip=' + this.state.stationsDisplayed );
        if(response.ok)
        {
          const json = await response.json();
          this.setState({
            searchData: [...this.state.searchData,...json],
            stationsDisplayed: this.state.stationsDisplayed + json.length,
            shouldLoadMore: ( json.length === 10 )
          });
        }
        else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      }
    } catch(error) {
      alert("could not fetch search results.\nError: "+ error.message);
    }
    window.scrollTo(x,y);
  }

  render() {
    return(
      <div className = "envelope">
        <div className = "container">
          <div className = "row row-contents justify-content-center">
            <div className = { "col-11 elec-search-box" }>
              <h1 className = "search-heading text-left text-md-center">Search.</h1>
              <h6 className = "elec-search-sub-text text-left text-md-center d-none d-md-block">
              Find the course you are looking for according to the priorities you set.<br />
              Search by name or courseNo, filter according to your preferences.
              </h6>
              <h6 className = "elec-search-sub-text text-left text-md-center d-block d-md-none">
              We will try to find what you are looking for
              </h6>
              <div className = "search-bar-hold">
                <Form className = "row " autoComplete = "off">
                  <div className = "col-12 col-md-8 offset-md-2 text-left text-md-center padding-remover">
                  <Input type = "text"
                    name = "Search"
                    defaultValue = { this.findplaceholder() }
                    placeholder = "Search"
                    className = "home-search-bar"
                    onChange = { (event) => {this.storeSearch(event)}} />
                  </div>
                  <div className = "col-6 col-md-4 offset-md-2 text-left text-md-left padding-remover">
                    <FormGroup check inline className = "mt-4">
                      <Label check className = "elec-label-font">
                        <Input type = "radio"
                         name = "searchMethod" 
                         value = "title" 
                         checked = { this.state.searchMethod === "title" }
                         onChange = {this.changeSearchMethod} /> By Name
                      </Label>
                    </FormGroup>
                    <FormGroup check inline className = "mt-4">
                      <Label check className = "elec-label-font">
                        <Input type = "radio" 
                         name = "searchMethod" 
                         value = "number"
                         checked = { this.state.searchMethod === "number" } 
                         onChange = {this.changeSearchMethod} /> By CourseNo.
                      </Label>
                    </FormGroup>
                  </div>
                  <div className = "col-6 col-md-4 text-right text-md-right padding-remover">
                    <Button className = "elec-search-button mt-4 ml-md-3" onClick = {(event) => { this.handleEmptytype(event) }} type = "submit" >Search</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className = "container d-none d-lg-block">
          <div className = "row row-contents justify-content-center align-items-start">
            <div className = "col-4 filter-box text-left">
              <h1 className = "text-left elec-filter-heading pb-1">Filters</h1>
              <Form className = "row ml-3" autoComplete = "off">
                <FormGroup check className = "col-12 mb-2">
                  <Label check className = "filter-label-font">
                      <Input value = "checked-all" type = "checkbox" checked = {this.state.allCheck} onClick = {(event) => {this.toggleCheck(event)}} />Select All
                  </Label>
                </FormGroup>
                { this.state.courses.map((course => {
                  return(
                    <CheckBox {...course} handleCheckChild = {this.handleCheckChild} />
                  );
                }))}
              </Form>
              <Link>
                <Button className = "ml-3 apply-filter-button mb-3 mt-2 pb-2" to = { window.localStorage.getItem("stationNo") + '/home/filtered' }>Apply</Button>
              </Link>
            </div>
            <div className = "col-6 offset-1 results-box mb-4">
              <div>
                <ListDisplay 
                 list = {this.state.searchData} 
                 title = {this.state.resultTitle} 
                />
              </div>
              { this.state.shouldLoadMore ? 
                <Button color = "link outline-none" 
                 onClick = { (event) => { this.loadMore(event) } } 
                 className = "btn mb-1 load-more"
                 value = "load More"><h5>LOAD MORE</h5></Button> 
              : null}
            </div>
          </div>
        </div>
        <div className = "row row-contents d-block d-lg-none justify-content-center">
          <div className = "filter-box-small">
            <h2 className = "elec-filter-heading pt-2 pb-2">Filters</h2>
            <div className = "offset-2 col-8 offset-sm-3 col-sm-6">
              <Button className = "btn btn-primary small-filter-chooser mb-3" onClick = {this.togglefiltersmall}>
                <span className = "fa fa-caret-down" />&nbsp;&nbsp;Select filters&nbsp;&nbsp;<span className = "fa fa-caret-down" />
              </Button>
              <CSSTransition
                in = {this.state.isfilterOpen}
                timeout = {500}
                appear = {true}
                classNames = "slide"
                mountOnEnter = {true}
                unmountOnExit = {true}>  
                <div className = "filter-pop-up">
                  <div className = "row">
                    <div className = "col-12 text-right">
                      <Button onClick = {this.togglefiltersmall} className = "btn btn-primary pop-up-close my-2 mr-3">
                        <span className = "fa fa-lg fa-times cross"></span>
                      </Button>
                    </div>
                    <div className = "col-12">
                      <Form className = "row ml-3" autoComplete = "off">
                        <FormGroup check className = "col-12 mb-2">
                          <Label check className = "filter-label-font">
                              <Input value = "checked-all" type = "checkbox" checked = {this.state.allCheck} onClick = {(event) => {this.toggleCheck(event)}} />Select All
                          </Label>
                        </FormGroup>
                        { this.state.courses.map((course => {
                          return(
                            <CheckBox {...course} handleCheckChild = {this.handleCheckChild} />
                          );
                        }))}
                      </Form>
                    </div>
                  </div>
                </div>
              </CSSTransition>
            </div>
            <div className = "col-12">
              <Link>
                <Button className = "apply-filter-button mb-4 mt-2 pb-2" to = { window.localStorage.getItem("stationNo") + '/home/filtered' }>Apply</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className = "container">
          <div className = "justify-content-center row row-contents d-flex d-lg-none">
            <div className = "col-11 results-box mb-4">
              <div>
                <ListDisplay 
                  list = {this.state.searchData} 
                  title = {this.state.resultTitle} 
                />
              </div>
              { this.state.shouldLoadMore ? 
                <Button color = "link outline-none" 
                 onClick = { (event) => { this.loadMore(event) } } 
                 className = "btn mb-1 load-more"
                 value = "load More"><h5>LOAD MORE</h5></Button> 
              : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CourseDisplay;