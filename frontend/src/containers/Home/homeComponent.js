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
import HuelCombine from './HuelCombine/huelCombineComponent';
import { connect } from 'react-redux';
import * as loginCreators from '../../store/actions/login';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    console.log("should we log in");
    if(document.cookie.split(';').some((item) => item.trim().startsWith('jwt='))) {
      this.props.handleLogin();
      console.log("logged in");
    }
    return null;
  }

  render() {
    let stationNo = parseInt(this.props.match.params.stationNo);   //client's choice for sub-part is taken out from url
    window.localStorage.setItem("stationNo",stationNo.toString(10)); //sub-part choice updated in localStorage
    if(stationNo === 1 || stationNo === 2) {     //if ps stations want to be viewed
      return(
        <div>
          <Header 
           loggedIn = {this.props.loginHandle}
           logout = {this.props.handleLogout}
           urlinfo = {this.props.match}
           location = {this.props.location} />
          <Switch>
            <Route path = {this.props.match.url + '/home' } >
              <Homed isFetched = {this.props.stationListFetched}
                list = {this.props.stationsList}
                isLoading = {this.props.stationsLoading}
                fetchError = {this.props.stationsError}
                stationIndex = {this.props.stationIndex}
              />
            </Route>
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
          <ElecHeader 
           loggedIn = {this.props.loginHandle} 
           urlinfo = {this.props.match}
           logout = {this.props.handleLogout}
           location = {this.props.location} />
          <Switch>
            <Route path = {this.props.match.url + '/home' } >
              <ElecHomed 
                isFetched = {this.props.courseListFetched}
                list = {this.props.coursesList}
                isLoading = {this.props.coursesLoading}
                fetchError = {this.props.coursesError}
              />              
            </Route>
            <Route path = {this.props.match.url + '/contact' } component = {Contact} />
            <Route path = {this.props.match.url + '/course/:courseSlug' } component = {CourseDisplay} />
            <Route path = {this.props.match.url + '/feedback'} >
              <HuelFeedback loggedIn = {this.props.loginHandle}  />
            </Route>
            <Route path = {this.props.match.url + '/huels'} component = {HuelCombine} />
            <Redirect to = {this.props.match.url + '/home'} />
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

const mapStatetoProps = state => {    //accepts the present state of redux store as argument
  return {
    loginHandle: state.logStatus.loggedIn,
    coursesList: state.courseStatus.data,
    coursesError: state.courseStatus.error,
    coursesLoading: state.courseStatus.loading,
    courseListFetched: state.courseStatus.dataFetched,
    stationsList: state.stationStatus.data,
    stationsLoading: state.stationStatus.loading,
    stationsError: state.stationStatus.error,
    stationListFetched: state.stationStatus.dataFetched,
    stationIndex: state.stationStatus.index
  };
}

const mapDispatchtoProps = dispatch => {    //gives access to functions that can manipulate redux store 
  return {
    handleLogin: () => dispatch(loginCreators.login()),
    handleLogout: () => dispatch(loginCreators.logout())
  }
}

//connect returns a function that returns a function for generating the higher order component
export default connect( mapStatetoProps, mapDispatchtoProps )(Home);   //mapping redux state to this component's props