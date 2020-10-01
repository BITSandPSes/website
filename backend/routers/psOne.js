const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Station = require('../models/station');

// get details of a station for ps1
router.get('/api/1/:station', async (req, res) => {
  const station = await Station.findOne({ category: { type: 'ps1' }, slug: req.params.station });

  if (!station) {
    res.status(404).send();
  } else {
    const stationJSON = await station.allData();
    res.send(stationJSON);
  }
});

// search the stations by name for ps1
router.get('/api/1', async (req, res) => {
  const queries = {
    category: { type: 'ps1' }
  };

  if (req.query.name) {
    queries.name = { $regex: new RegExp(req.query.name, 'i') };
  }

  if (req.query.location) {
    queries.location = { $regex: new RegExp(req.query.location, 'i') };
  }

  if (req.query.industryDomain) {
    queries.location = { $regex: new RegExp(req.query.industryDomain, 'i') };
  }

  if (req.query.branch) {
    queries.location = { $regex: new RegExp(req.query.branch, 'i') };
  }

  try {
    const stations = await Station.find(queries,
      'name category field location cg slug industryDomain branch',
      {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      });

    res.send(stations);
  } catch (e) {
    res.status(400).send(e);
  }
});

// post a new comment on the opportunity for ps1
router.post('/api/1/:station/comment', auth, async (req, res) => {
  const station = await Station.findOne({ category: { type: 'ps1' }, slug: req.params.station });

  if (!station) {
    return res.status(404).send('Station not found');
  }

  station.discussion.push({
    comment: {
      user: req.user._id,
      data: req.body.data
    }
  });

  try {
    await station.save();
    const stationJSON = await station.allData();
    res.send(stationJSON);
  } catch (e) {
    res.status(400).send(e);
  }
});

// post a new reply on a comment for ps1
router.post('/api/1/:station/:comment/reply', auth, async (req, res) => {
  const station = await Station.findOne({ category: { type: 'ps1' }, slug: req.params.station });

  if (!station) {
    return res.status(404).send('Station not found');
  }

  // eslint-disable-next-line eqeqeq
  const commentIndex = station.discussion.findIndex((comment) => comment._id == req.params.comment);

  if (commentIndex === -1) {
    return res.status(404).send('Comment not found');
  }

  station.discussion[commentIndex].comment.replies.push({
    user: req.user._id,
    data: req.body.data
  });

  try {
    await station.save();
    const stationJSON = await station.allData();
    res.send(stationJSON);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
