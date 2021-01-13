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

  if (feedbacks.length === 0) {
    return { course, users };
  }

  const num_feedbacks = feedbacks.length;

  course.experience = feedbacks.reduce((total, next) => total + next.ratings.experience, 0) / num_feedbacks;
  course.lite = feedbacks.reduce((total, next) => total + next.ratings.lite, 0) / num_feedbacks;
  course.grade = feedbacks.reduce((total, next) => total + next.ratings.grade, 0) / num_feedbacks;

  course.maxPR = feedbacks.reduce((a, b) => a.pr > b.pr ? a:b).pr
  course.minPR = feedbacks.reduce((a, b) => a.pr < b.pr ? a:b).pr

  course.feedbacks = feedbacks;

  // find the course rank by number of feedbacks
  const all = await Feedback.find().lean();

  const courses = {};

  all.forEach(feedback => {
    if (courses[feedback.course]) {
      courses[feedback.course] += 1;
    } else {
      courses[feedback.course] = 1;
    }
  })


  const sortable = [];
  for (const course in courses) {
    sortable.push([course, courses[course]]);
  }

  sortable.sort((a, b) => {
    return b[1] - a[1];
  });

  course.rank = sortable.filter(c => c[1] > feedbacks.length).length + 1

  return { course, users };
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
