var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    photoId:{type : String , required : true},
    photoUrl: String,
    tinyUrl: String,
    metadata: String,
    public: {type: Boolean, default: false}
},{ _id : false });

var albumSchema = new mongoose.Schema({
	albumId:{type : String , required : true},
    albumName: String,
    createAt: {type: Date, default: Date.now}
    //photos: [photoSchema]
},{ _id : false });

var userSchema = new mongoose.Schema({
    userId : {type : String , required : true, unique: true, dropDups: true},
    name: {type : String , required : true},
    email: {type : String , required : true},
    profilepicUrl : String,
    album:[albumSchema]
});

module.exports = mongoose.model('User', userSchema);