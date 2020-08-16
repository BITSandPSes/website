import React, { Component } from 'react';
import "./home.css";
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import NotFound from '../NotFound/notfoundComponent';
import Header from './Header/headerComponent';
import Homed from './Homed/homedComponent';
import StationDisplay from './StationDetails/stationDisplayComponent';
import ElecHomed from './ElecHomed/elechomedComponent';
import CourseDisplay from './CourseDisplay/courseDisplayComponent';
import ElecHeader from './ElecHeader/elecHeaderComponent';
import Contact from './Contact/contactComponent';
import Footer from './Footer/footerComponent';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let stationNo = parseInt(this.props.match.params.stationNo);
    window.localStorage.setItem("stationNo",stationNo.toString(10));
    if(stationNo === 1 || stationNo === 2) {
      return(
        <div>
          <Header urlinfo = {this.props.match} />
          <Switch>
            <Route path = {this.props.match.url + '/home' } component = {Homed} />
            <Route path = {this.props.match.url + '/contact' } component = {Contact} />
            <Route path = {this.props.match.url + '/station/:stationName'} component = {StationDisplay}/>
            <Redirect to = {this.props.match.url + '/home'} />
          </Switch>
          <Footer />
        </div>
      );
    }
    if( stationNo === 3) {
      return(
        <div>
          <ElecHeader urlinfo = {this.props.match} />
          <Switch>
            <Route path = {this.props.match.url + '/home' } component = {ElecHomed} />
            <Route path = {this.props.match.url + '/contact' } component = {Contact} />
            <Route path = {this.props.match.url + '/course/:courseSlug' } component = {CourseDisplay} />
            <Redirect to = {this.props.match.url + '/home'} />
          </Switch>
          <Footer />
        </div>
      );
    }
    else {
      return(
        <Route component = {NotFound} />
      );
    }
  }
};

export default Home;