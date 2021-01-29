import React, { Component } from 'react';
import { Link } from 'react-router-dom';

function ListDisplay({ list, title }) {
  return (
    <div>
      <h1 className={"elec-result-title"}>{title}</h1>
      <ul className="list-unstyled">
        {list.map((item) => {
          return (
            <li>
              <Link className="station-linker" to={'/' + window.localStorage.getItem("stationNo") + '/course/' + item.slug} >
                <div className="my-3 mx-2 station-links">
                  <h5 className={"text-left elec-station-link-header"}>{item.title}</h5>
                  <h6 className="location-station text-left">{"Number: " + item.number}</h6>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListDisplay