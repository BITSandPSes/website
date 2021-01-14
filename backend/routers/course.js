const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/course');
const mongoose = require('mongoose');
const Feedback = require('../models/feedback')

// get details of a course
router.get('/api/course/:slug', async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    if (!course) {
      res.status(404).send();
    } else {
      const courseJSON = await course.allData();
      res.send(courseJSON);
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// search for the courses
router.get('/api/course', async (req, res) => {
  const queries = {};

  if (req.query.number) {
    queries.number = { $regex: new RegExp(req.query.number, 'i') };
  }

  if (req.query.title) {
    queries.title = { $regex: new RegExp(req.query.title, 'i') };
  }

  try {
    const courses = await Course.find(queries,
      'number title slug',
      {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      });

    res.send(courses);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// post a new comment on the course
router.post('/api/course/:slug/comment', auth, async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });

  if (!course) {
    return res.status(404).send('Course not found');
  }

  course.discussion.push({
    comment: {
      user: req.user._id,
      data: req.body.data
    }
  });

  try {
    await course.save();
    const courseJSON = await course.allData();
    res.send(courseJSON);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// post a new reply on a comment
router.post('/api/course/:slug/:comment/reply', auth, async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });

  if (!course) {
    return res.status(404).send('Course not found');
  }

  // eslint-disable-next-line eqeqeq
  const commentIndex = course.discussion.findIndex((comment) => comment._id == req.params.comment);

  if (commentIndex === -1) {
    return res.status(404).send('Comment not found');
  }

  course.discussion[commentIndex].comment.replies.push({
    user: req.user._id,
    data: req.body.data
  });

  try {
    await course.save();
    const courseJSON = await course.allData();
    res.send(courseJSON);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/api/course/feedback', auth, async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.body.course });

    if (!course) {
      return res.status(404).send('Course not found');
    }

    const prev = await Feedback.find({ user: req.user._id });

    const hasAlreadyFeedback = prev.find(f => String(f.course) === String(course._id))

    if (hasAlreadyFeedback) {
      return res.status(400).send('Cannot submit feedback for same course twice')
    }

    if (prev.length >= 3) {
      return res.status(400).send('Cannot submit more than 3 feedbacks');
    }
  
    const feedback = new Feedback({
      user: req.user._id,
      course: course._id,
      pr: req.body.pr,
      ratings: req.body.ratings,
      feedbacks: req.body.feedbacks
    })
  
    await feedback.save();
    res.send(feedback)
  } catch(e) {
    res.status(400).send(e.message);
  }
})

router.get('/api/huels', async (req, res) => {
  try {
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

    const final = [];

    for (let i = 0; i < sortable.length; i++) {
      const course = await Course.findOne({ _id: sortable[i][0] })
      const o = {};
      o.title = course.title;
      o.number = course.number;
      o.slug = course.slug;
      o.feedbacks = sortable[i][1];
      final.push(o)
    }
    
    res.send(final);
  } catch(e) {
    console.log(e);
    res.status(500).send(e.message);
  }
}) 

module.exports = router;
