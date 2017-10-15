'use strict';

const mongoose = require(`mongoose`);
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/todo-test`, {
  useMongoClient: true
});

module.exports = {
  List: require(`./List.js`)
}
