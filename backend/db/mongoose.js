// using the mongoose ODM
const mongoose = require('mongoose');

// async function to connect to database
const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('Successfully connected to database :)');
  } catch (error) {
    console.log('Not able to connect to database :(', error);
  }
};

module.exports = db;
