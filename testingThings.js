const moment = require('moment');
const { isVAlidEmail } = require('./src/api/middlewares/helpers');

console.log(moment().format());

console.log(isVAlidEmail('eneja_kc@gmail.net'));
