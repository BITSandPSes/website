import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import Choose from './Choose/chooseComponent';
import Home from './Home/homeComponent';

class Main extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    console.log(this.props);
    return(
      <Switch>
        <Route path = "/" exact component = {Choose} />
        <Route path = "/:stationNo" component = {Home} />
      </Switch>
    );
  };
};

export default withRouter(Main);