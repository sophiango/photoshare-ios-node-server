var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    photoId:{type : String , required : true},
    albumId:{type : String , required : true},
    userId:{type : String , required : true},
    photoUrl: String,
    tinyUrl: String,
    metadata: String,
    public: {type: Boolean, default: false}
});

module.exports = mongoose.model('Photo', photoSchema);