var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    photoId:{type : String , required : true},
    albumId:{type : String , required : true},
    userId:{type : String , required : true},
    photoName: String,
    photoUrl: String,
    metadata: String,
    location: String,
    public: {type: Boolean, default: true}
});

module.exports = mongoose.model('Photo', photoSchema);