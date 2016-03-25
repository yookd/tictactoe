'use strict';

require('babel-core/register')({
  presets: ['react', 'es2015']
});

var server = require('./server').default;

const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
  console.log('Server listening on', PORT);
});