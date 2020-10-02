const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const User = require('./user');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: { type: String, enum: ['ps1', 'ps2'] }
  },
  field: {
    type: { type: String, enum: ['IT', 'Finance', 'Consulting', 'Mechanical', 'Chemical', 'Civil', 'Biology', 'Instrumentation', 'Electrical', 'Social'] }
  },
  location: {
    type: String
  },
  cg: {
    pilani: {
      type: Number,
      min: 0,
      max: 10
    },
    goa: {
      type: Number,
      min: 0,
      max: 10
    },
    hyderabad: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  industryDomain: {
    type: String,
  },
  branches:[{
    type: String
  }],
  discussion: [{
    comment: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      data: {
        type: String
      },
      replies: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        data: {
          type: String
        }
      }]
    }
  }]
});

stationSchema.plugin(URLSlugs('name'));

stationSchema.methods.allData = async function () {
  const station = this.toObject();

  let usersList = [];

  // iterate over the discussion comments
  for (let i = 0; i < station.discussion.length; i++) {
    // push the user id of comment author
    usersList.push(station.discussion[i].comment.user);

    // iterate over the comment replies
    for (let j = 0; j < station.discussion[i].comment.replies.length; j++) {
      usersList.push(station.discussion[i].comment.replies[j].user);
    }
  }

  // remove duplicates
  usersList = Array.from(new Set(usersList.map(JSON.stringify))).map(JSON.parse);

  // find the users in the database
  const users = await User.find().where('_id').in(usersList).exec();

  // convert the users to JSON
  for (let i = 0; i < users.length; i++) {
    users[i] = await users[i].toJSON();
  }

  return { station, users };
};

const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
