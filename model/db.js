var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/phoneZone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', (err)=>{
    console.log('database connect failed');
});

db.once('open', ()=>{
    console.log('database connect OK!');
});

module.exports = mongoose;