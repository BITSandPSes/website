// require the express app from app.js
const app = require('./app');

// port setup on deployment as environment variable
const port = process.env.PORT || 8080;

// start server
app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
