const Main = require('./src/handler/handler');
const Auth = require('./src/handler/auth');
module.exports.endpoint = Main.endpoint;
module.exports.public = Main.public;
module.exports.auth = Auth.auth;