const path = require('path');

// express framework
const express = require('express');
const cookieParser = require('cookie-parser');

// allow CORS
var cors = require('cors')

// request logger
const morgan = require('morgan');

// admin panel
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');

// database connection
const db = require('./db/mongoose');
db();

// models
const User = require('./models/user');
const Station = require('./models/station');
const Course = require('./models/course')

// setup admin panel
AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  resources: [
    User,
    Station,
    Course
  ],
  rootPath: '/admin'
});

const adminPanelRouter = AdminBroExpress.buildRouter(adminBro);

// routers
const googleLoginRouter = require('./oauth2/googleAuthRouters');
const psOneRouter = require('./routers/psOne');
const psTwoRouter = require('./routers/psTwo');
const courseRouter = require('./routers/course');

// define express app
const app = express();

// add public directory path
app.use(express.static(path.join(__dirname, '../frontend/build')));

// use the middleware functions
app.use(morgan('tiny'));
// enabling CORS
app.use(cors())
app.use(adminBro.options.rootPath, adminPanelRouter);
app.use(cookieParser());
app.use(express.json());
app.use(googleLoginRouter);
app.use(psOneRouter);
app.use(psTwoRouter);
app.use(courseRouter);

// Handles any requests that don't match the ones above
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// exports
module.exports = app;
