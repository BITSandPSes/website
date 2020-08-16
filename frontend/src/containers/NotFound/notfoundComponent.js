import React from 'react';
import {Link} from 'react-router-dom';

function Notfound () {
  return(
    <div>
      <h1>Error 404</h1>
      <h3>Oops! Page not found</h3>
      <h5>Return to home page.</h5>
      <Link className = "btn btn-primary" to = "/">Home</Link>
    </div>
  );
};

export default Notfound;