import React, { Component } from 'react';
import Select, {components} from 'react-select';
import { Redirect } from 'react-router'

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      options: this.props.options,
      loc: this.props.loc,
      redirect: null,
    }
  }

  handleChange = (e) => {
    this.setState({
      redirect: e.value
    })
  }

  render() {
    console.log(this.state)

    if (this.state.redirect) {
      return(
        // this should have been internal redirect but component does not render again
        window.location.href = this.state.loc +  this.state.redirect
        // <Redirect to = {this.state.loc + this.state.redirect}/>
      )
    }

    return(
      <Select
        onChange={this.handleChange}
        options={this.state.options}
      />
    )
  }
}

export default Search;
