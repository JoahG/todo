'use strict';

const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
  title: {
    type: String
  },
  done: {
    type: Boolean,
    default: false,
    required: true
  }
});

module.exports = mongoose.model(`List`, Schema({
  title: {
    type: String
  },
  items: [{
    type: ItemSchema
  }],
  updated_at: {
    type: Date,
    required: true,
    default: new Date(0)
  }
}));
