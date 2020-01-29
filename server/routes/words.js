const mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const Word = new Schema({
  name: String,
  type: [String],
  meaning: String,
  level: String,
  pronunciation: String,
  example: String,
  count: Number,
}, { timestamps: true });
const WordModel = mongoose.model('word', Word);

/* GET users listing. */
router.post('/', function (req, res, next) {
  WordModel.create(req.body, () => {
    res.send({});
  });
});

/* GET users listing. */
router.delete('/', function (req, res, next) {
  WordModel.remove(req.body, () => {
    res.send({});
  });
});

/* GET users listing. */
router.put('/', function (req, res, next) {
  WordModel.updateOne({ _id: req.body._id }, req.body, () => {
    res.send({});
  });
});

/* GET users listing. */
router.get('/', function (req, res, next) {
  WordModel.findOne(req.body, (err, result) => {
    res.send(result);
  });
});

/* GET users listing. */
router.get('/list', function (req, res, next) {
  const skip = Number(req.query.skip);
  const limit = Number(req.query.limit);
  delete req.query.skip;
  delete req.query.limit;
  const cond = {};
  if (req.query.count) {
    if (req.query.count.includes('>=')) {
      cond.count = { $gte: req.query.count.slice(2) };
    } else if (req.query.count.includes('<=')) {
      cond.count = { $lte: req.query.count.slice(2) };
    } else if (req.query.count.includes('>')) {
      cond.count = { $gt: req.query.count.slice(1) };
    } else if (req.query.count.includes('<')) {
      cond.count = { $lt: req.query.count.slice(1) };
    } else {
      cond.count = req.query.count;
    }
  } else if (req.query.level) {
    cond.level = req.query.level;
  } else if (Object.keys(req.query).length) {
    for (const key in req.query) {
      cond[key] = new RegExp(req.query[key]);
    }
  }
  WordModel.find(cond).skip(skip).limit(limit).sort({ createdAt: -1 }).exec((err, result) => {
    WordModel.countDocuments(cond, (err, total) => {
      res.send({ list: result, total });
    })
  });
});

module.exports = router;
