import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import Choose from './Choose/chooseComponent';
import Home from './Home/homeComponent';


//if anything is appended to the base url, client is redirected to sub-parts's home page ( not found dealt in home component only)
//Otherwise, redirected to chooser component where localStorage is checked for client's past history on the website
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