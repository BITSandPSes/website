import React, { Component } from 'react';
import "./home.css";
import { Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '../NotFound/notfoundComponent';  
import Header from './Header/headerComponent'; //header component for ps stations sub-parts
import Homed from './Homed/homedComponent'; //home component for ps stations sub-parts
import StationDisplay from './StationDetails/stationDisplayComponent'; //specific ps station details component
import ElecHomed from './ElecHomed/elechomedComponent'; //home component for electives sub-part
import CourseDisplay from './CourseDisplay/courseDisplayComponent'; //specific course details component
import ElecHeader from './ElecHeader/elecHeaderComponent'; //header component for electives sub-part
import Contact from './Contact/contactComponent'; //contact us page
import Footer from './Footer/footerComponent'; //footer component 
import HuelFeedback from './Feedback/feedbackComponent' ; //feedback component

class Home extends Component {
  constructor(props) {
    super(props);
    this.googleDirect = this.googleDirect.bind(this);
  }
  
  googleDirect = () => {
    const direct = window.localStorage.getItem("googleRedirect");
    if( direct != null) {
      window.localStorage.removeItem("googleRedirect");
      console.log(direct);
      return(
        <Redirect to = {this.props.match.url + direct} />
      );
    }
    return(
      <Redirect to = {this.props.match.url + '/home'} />
    );
  }

  render() {
    let stationNo = parseInt(this.props.match.params.stationNo);   //client's choice for sub-part is taken out from url
    window.localStorage.setItem("stationNo",stationNo.toString(10)); //sub-part choice updated in localStorage
    if(stationNo === 1 || stationNo === 2) {     //if ps stations want to be viewed
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
    if( stationNo === 3) {                //if electives want to be viewed
      return(
        <div>
          <ElecHeader urlinfo = {this.props.match} />
          <Switch>
            <Route path = {this.props.match.url + '/home' } component = {ElecHomed} />
            <Route path = {this.props.match.url + '/contact' } component = {Contact} />
            <Route path = {this.props.match.url + '/course/:courseSlug' } component = {CourseDisplay} />
            <Route path = {this.props.match.url + '/feedback'} component = {HuelFeedback} />
            <this.googleDirect />
          </Switch>
          <Footer />
        </div>
      );
    }
    else {                              //if client enters url containing anything apart from 1,2 or 3, trigger notFound
      return(
        <Route component = {NotFound} />
      );
    }
  }
};

export default Home;