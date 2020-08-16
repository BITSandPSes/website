import React from 'react';
import './chooser.css';
import { Link, Redirect } from 'react-router-dom';

function Choose () {
  const storedChoice = parseInt(window.localStorage.getItem("stationNo"));
  if(storedChoice === 1 || storedChoice === 2 || storedChoice === 3 ) {
    return(
      <Redirect to =  { "/" + storedChoice } />
    );
  }
  else {
    return(
      <div className = "bg-pattern">
        <div class = "container">
          <div class = "row justify-content-center">
            <h1 className = "web-name">
              <span className = "green">BITS</span>
              <span className = "dark-grey">and</span>
              <span className = "blue">PS</span>
              <span className = "dark-grey">es</span>
            </h1>
          </div>
          <div class = "row justify-content-center">
            <h1 className = "web-subname dark-grey">
              might save you from the factories
            </h1>
          </div>
          <div className = "chooser-buttons row justify-content-center">
            <Link className = "btn green-bg chooser-button align-self-center" to = { '/' + 1 }>
              <div className = "d-none d-lg-block align-items-center large-button-cont">
                <h3 className = "large-button-title">
                  PS1
                </h3>
                <h5 className = "large-button-sub">
                  if you lost your 60k
                </h5>
              </div>
              <h2 className = "d-block d-lg-none small-button-cont">PS1</h2>
            </Link>
            <div className = "button-gap display-inline"></div>
            <Link className = "btn blue-bg chooser-button align-self-center" to = { '/' + 2 }>
              <div className = "d-none d-lg-block large-button-cont">
                <h3 className = "large-button-title">
                  PS2
                </h3>
                <h5 className = "large-button-sub">
                  if you want to redeem your 60k
                </h5>
              </div>
              <h2 className = "d-block d-lg-none small-button-cont">PS2</h2>
            </Link>
          </div>
          <div className = "elective-button-row row justify-content-center">
            <div className = "col-6 col-md-5 col-lg-4">
              <Link className = "btn elective-button align-self-center" to = { '/' + 3 }>
                Electives
              </Link>
            </div>
          </div>
          <div className = "row justify-content-center">
            <h2 className = "col-7 disclaimer d-none d-lg-block">
            Made by two lonely guys in their pyjamas, dont shove our throats 
            if content on this website turns out to be slightly deviating from actual data. Just like with you,
            BITS Admin was a jerk to us too.
            </h2>
            <h2 className = "col-9 disclaimer d-block d-lg-none">
            Choose the left one if you were robbed 
            of 60k. Right one if you are looking
            to redeem the 60k.
            </h2>
          </div>
        </div>
      </div>
    );
  }
};

export default Choose;