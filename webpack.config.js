const path = require('path');

module.exports = {
  // ...other webpack configuration options

  devServer: {
    // ...other devServer options
    static: {
      directory: path.join(__dirname, 'public'), // Update with your static files directory
    },
    mimeTypes: {
      // Add this entry to handle js files
      'js': 'application/javascript',
    },
  },
};