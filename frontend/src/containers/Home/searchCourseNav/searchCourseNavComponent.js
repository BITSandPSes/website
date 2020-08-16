import React, { Component } from 'react';
import { Button, Row } from 'reactstrap';
import "./searchCourseNav.css";
import { Redirect } from 'react-router-dom';
import { LocalForm , Control } from 'react-redux-form';

const minLength = (len) => (val) => val && (val.length >= len);

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      router: false,
      searchField: null
    };
    this.preventSearch = this.preventSearch.bind(this);
  }

  preventSearch = (values) => {
    this.setState({
      router: true,
      searchField: values.search
    });
  }
  
  render() {
    return(
      <div className = "row row-search align-items-center fixed-top envelope zerk">
        <div className = "col-10 offset-1 col-md-8 offset-md-2 justify-content-center">
          <LocalForm onSubmit = { (values) => { this.preventSearch(values) } } autoComplete = "off" >
            <Row className = "form-group">
              <div className = "col-9 col-md-8 offset-md-1">
                <Control.text
                model = ".search"
                name = "search"
                id = "search"
                placeholder = "Search for course"
                className = "col-12 form-control search-nav"
                validators = { { minLength: minLength(1)} } />
              </div>
              <Button 
               type = "submit" 
               className = "btn col-3 col-md-2 align-self-start search-nav-button" >Search</Button>
            </Row>
          </LocalForm>
          { this.state.router ? 
            <Redirect to = { "/3/home?Search=" + this.state.searchField + "&searchMethod=title" } />
          : null}
        </div>
      </div>
    );
  }
};

export default SearchBar;