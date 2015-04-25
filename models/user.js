var mongoose = require('mongoose');

var albumSchema = new mongoose.Schema({
	id:Number,
    institution: String,
    degree: String,
    fromYear: String,
    toYear: String,
    photo: [photoSchema]
},{ _id : false });

var photoSchema = new mongoose.Schema({
	id:Number,
    position: String,
    company: String,
    from: String,
    to: String,
    description:String
},{ _id : false });

var statusSchema = new mongoose.Schema({
    content: String,
    createAt: {type: Date, default: Date.now}
})

var userSchema = new mongoose.Schema({
    userId : {type : String , required : true, unique: true, dropDups: true},
    firstName: {type : String , required : true},
    lastName: {type : String , required : true},
    imageUrl : String,
    headline : String,
    skills: [String],
    album:[albumSchema]
});

module.exports = mongoose.model('User', userSchema);