'use strict';

const express = require(`express`),
      router = express.Router(),
      { List } = require(`../models`);

router.post(`/lists`, (req, res) => {
  let list = new List(req.body);
  list.updated_at = new Date();

  list.save((err) => {
    if (err) {
      return res.json({
        success: false,
        message: `Error creating list.`
      });
    }

    return res.json({
      success: true,
      id: list._id
    });
  });
});

router.get(`/lists/:id`, (req, res) => {
  List.findOne({
    _id: req.params.id
  }, (err, list) => {
    if (err || !list) {
      return res.json({
        success: false,
        message: `List not found`
      });
    }

    res.json({
      success: true,
      list
    });
  });
});

router.put(`/lists/:id/items/:item_id`, (req, res) => {
  List.findOne({
    _id: req.params.id
  }, (err, list) => {
    if (err || !list) {
      return res.json({
        success: false,
        message: `List not found`
      });
    }

    let item = list.items.filter((i) => i._id.toString() == req.params.item_id)[0];

    if (!item) {
      if (req.params.item_id !== `new`) {
        return res.json({
          success: false,
          message: `Item not found`
        });
      }

      list.items.push(req.body);
    } else {
      list.items.map((i) => {
        if (i._id.toString() == req.params.item_id) {
          i.title = req.body.title;
          i.done = req.body.done;
        }

        return i;
      });
    }

    list.updated_at = new Date();

    list.save((err) => {
      if (err) {
        return res.json({
          success: false,
          message: `Error saving list.`
        });
      }

      return res.json({
        success: true
      });
    });
  });
});

module.exports = router;
