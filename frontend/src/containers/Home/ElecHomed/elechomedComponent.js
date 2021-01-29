import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Label } from 'reactstrap';
import "./elecHomed.css";
import CheckBox from './checkBoxComponent';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';
import Search from '../search/search'
import ListDisplay from './list'

class CourseDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all: [],
      showing: [],
      options: [],
      resultTitle: 'Courses',
      branches: [
        { id: 1, value: "BITS", name: "General", isChecked: false},
        { id: 2, value: "BIO|BIOT", name: "Biology", isChecked: false },
        { id: 3, value: "CE", name: "Civil", isChecked: false },
        { id: 4, value: "CHE", name: "Chemical", isChecked: false },
        { id: 5, value: "CHEM", name: "Chemistry", isChecked: false },
        { id: 6, value: "CS", name: "Computer Science", isChecked: false },
        { id: 7, value: "ECON", name: "Economics", isChecked: false },
        { id: 8, value: "EEE", name: "Electrical & Electronics", isChecked: false },
        { id: 9, value: "GS|HSS", name: "Humanities", isChecked: false },
        { id: 10, value: "INSTR", name: "Instrumentation", isChecked: false },
        { id: 12, value: "MATH", name: "Mathematics", isChecked: false },
        { id: 13, value: "MBA", name: "MBA", isChecked: false },
        { id: 14, value: "ME", name: "Mechanical", isChecked: false },
        { id: 15, value: "MF", name: "Manufacturing", isChecked: false },
        { id: 16, value: "PHA", name: "Pharmacy", isChecked: false },
        { id: 17, value: "PHY", name: "Physics", isChecked: false },
      ],
      isfilterOpen: false,
      allCheck: true
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
        all: data,
        options: options
      });

      console.log(this.state)
      const event = { target: { checked: true }}
      this.toggleCheck(event);
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
    let courses = this.state.branches;
    if(event.target.checked) {
      this.setState({
        allCheck: true,
        showing: this.state.all
      });
    }
    else {
      this.setState({
        allCheck: false,
        showing: []
      })
    }
    courses.forEach((course) => {
      course.isChecked = event.target.checked
    });

    this.setState({
      courses: courses
    })
  }

  handleCheckChild = (event) => {
    console.log(this.state.branches, new RegExp(event.target.value))
    const toggled = this.state.branches.filter(c => c.value === event.target.value)[0]
    toggled.isChecked = event.target.checked;

    this.setState({
      courses: this.state.branches
    });

    if (event.target.checked) {
      const add = this.state.all.filter((course) => course.number.split(' ')[0].match(new RegExp(event.target.value)))
      this.setState({
        showing: [...add, ...this.state.showing]
      })
    } else {
      this.setState({
        showing: this.state.showing.filter((course) => !course.number.split(' ')[0].match(new RegExp(event.target.value)))
      })
    }
  }

  render() {
    return(
      <div className = "envelope">
        <div className = "container">
          <div className = "row row-contents justify-content-center">
            <div className = { "col-11 elec-search-box" }>
              <div className = "search-bar-hold">
                  <Search key = { this.state.options }options = {this.state.options} loc = {'/3/course/'}/>
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
                { this.state.branches.map((course => {
                  return(
                    <CheckBox {...course} handleCheckChild = {this.handleCheckChild} />
                  );
                }))}
              </Form>
            </div>
            <div className = "col-6 offset-1 results-box mb-4">
              <div>
                <ListDisplay 
                 list = {this.state.showing} 
                 title = {this.state.resultTitle} 
                />
              </div>
            </div>
          </div>
        </div>
        <div className = "row row-contents d-block d-lg-none justify-content-center">
          <div className = "filter-box-small">
            <div className = "offset-2 col-8 offset-sm-3 col-sm-6">
              <br/>
              <Button className = "btn btn-primary small-filter-chooser mb-3" onClick = {this.togglefiltersmall}>
                <h4>Filters &nbsp; <span className = "fa fa-caret-down" /></h4>
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
                        { this.state.branches.map((course => {
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
          </div>
        </div>
        <div className = "container">
          <div className = "justify-content-center row row-contents d-flex d-lg-none">
            <div className = "col-11 results-box mb-4">
              <div>
                <ListDisplay 
                  list = {this.state.showing} 
                  title = {this.state.resultTitle} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CourseDisplay;