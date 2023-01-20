const moment = require('moment');
 
 function formatMessages (username,text){

    return{
        username,
        text,
        time:moment().format('h:m a')
    }

}

module.exports = formatMessages;