const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const User = require('./user');
const Feedback = require('./feedback');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  link: {
    type: String,
    trim: true
  },
  resources: [{
    link: {
      type: String,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
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

courseSchema.plugin(URLSlugs('number'));

courseSchema.methods.allData = async function () {
  const course = this.toObject();

  let usersList = [];

  // iterate over the discussion comments
  for (let i = 0; i < course.discussion.length; i++) {
    // push the user id of comment author
    usersList.push(course.discussion[i].comment.user);

    // iterate over the comment replies
    for (let j = 0; j < course.discussion[i].comment.replies.length; j++) {
      usersList.push(course.discussion[i].comment.replies[j].user);
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

  // populate the feedbacks
  const feedbacks = await Feedback.find({ course: this._id }).populate('user', 'name email').populate('course', 'title number');

  return { course, users, feedbacks };
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
