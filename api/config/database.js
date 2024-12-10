const { connect } = require('mongoose');
require('dotenv').config();
const { URI } = process.env;

const connection = connect(URI);

module.exports = connection;
