var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Photo = require('../models/photo');
var chance = require('chance').Chance();
var util = require('util');
var fs = require('fs');
var multer = require ('multer');
var AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIAJRSSTBSKXU62UWUA',
    secretAccessKey: '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',
    region:'us-west-1'
});
var s3= new AWS.S3();

// Set Destination folder
// configure multer
router.use(multer({ dest: './uploads6/',
    rename: function (fieldname, filename) {
        return filename+Date.now();
    },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done=true;
    }
}));

router.get('/:user_id', function (req, res) { // get user profile by id
    var user_id = req.params.user_id;
    if (user_id < 0) {
        res.status(404).send('Invalid user id');
    }
    User.findOne({userId:user_id},function(err,foundUser){
        if (err || foundUser===null) {
            res.status(404);
            res.setHeader('Content-Type', 'application/json');
            res.json({
                "message": "User Not Found"
            });
        }
        else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.json({
                "user": foundUser
            });
        }
    });
});

//app.use(session({
//    secret: 'keyboard cat',
//    resave: true,
//    saveUninitialized: true
//}));

// when user successfully log in with facebook, it will hit this
router.post('/',function(req,res){
    if (req.body.userId == "0"){
        res.status(200);
        console.log("This is a guest user");
        res.setHeader('Content-Type', 'application/json');
        res.json({
            "success": "use guest account",
            "userIDs": "0",
            "name": "Guest",
            "email" : "guest@gmail.com"
        });
    }
    else {
        User.count({userId: req.body.userId}, function (err, count) {
            if (count <= 0) {// user not exist ,create new user
                var newUser = new User({
                    userId: req.body.userId, // facebook id
                    name: req.body.name,
                    email: req.body.email,
                    profilepicUrl: req.body.profilepicUrl,
                    album: [{
                        albumId: "0", // default album
                        albumName: "Default" // createAt by default
                    }]
                });
                console.log(newUser);
                newUser.save(function (err, newUser) {
                    if (err) {
                        console.log(err);
                        res.status(404).send(err);
                    }
                    else {
                        console.log("Success");
                        res.status(201);
                        res.setHeader('Content-Type', 'application/json');
                        var mongoresponse = User;
                        console.log("mongoresponse==" + newUser);
                        // Send success response back.
                        res.json({
                            "success": "user created",
                            "userIDs": req.body.userId,
                            "mongodata": newUser
                        });
                    }
                });
            }
            else { // user exist
                res.status(200);
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    "message": "user already exist",
                    "error": err,
                    "userId": req.body.userId
                });
            }
        });
    }
});

router.post('/:user_id/album',function (req, res) { // create new album
    var album_id = chance.natural({min: 1, max: 1000}).toString();
    User.findOne({userId:req.params.user_id}, function (err, foundUser) {
        if (err) {
            res.status(404).send("Cannot find user with that id");
        }
        else {
            foundUser.album.push({
                albumId:album_id,
                albumName: req.body.albumName
            });
            foundUser.save(function (err) {
                if (err) {
                    res.status(404);
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        "message": "Cannot create album"
                    });
                }
                else{
                    res.status(200);
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        "userId": req.params.user_id,
                        "albumId": album_id,
                        "albumName": req.body.albumName
                    });
                }
            });
        }
    });
});

router.get('/:user_id/album/',function (req, res) {
    User.find({userId:req.params.user_id},{album:1}, function (err, result) {
        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send("Cannot find user or album with given id");
        }
        else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        }
    });
});

router.get('/:user_id/album/:album_id',function (req, res) { // get album by id
    User.findOne({userId:req.params.user_id, 'album.albumId': req.params.album_id},{'album.$': 1}, function (err, result) {
        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send("Cannot find user or album with given id" + err);
        }
        else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(result);
        }
    });
});

router.delete('/:user_id/album/:album_id',function (req, res) { // delete album by id
    User.update({userId:req.params.user_id},
        {$pull:{album:{albumId:req.params.album_id}}},
        {safe:true},
        function (err, result) {
            if (err) {
                console.log(err);
                res.setHeader('Content-Type', 'application/json');
                res.status(404).send("Cannot find user or album with given id" + err);
            }
            else {
                console.log("second delete in photo collection");
                Photo.remove({userId:req.params.user_id, albumId: req.params.album_id},function(err,result){
                    if (err) {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(404).send("Cannot find user or album with given id" + err);
                    }
                    else{
                        console.log("successfully remove");
                        res.setHeader('Content-Type', 'application/json');
                        res.status(204).send(result);
                    }
                })
            }
        });
});

router.post('/:user_id/album/:album_id/photo',function (req, res) { // create new photo
    var photo_id = chance.natural({min: 1, max: 1000}).toString();
    var url="";
    console.log(req.body);
    console.log("----"+util.inspect(req.files));
    console.log(util.inspect(req.files, false, null));
    console.log("des path"+req.files.thumbnail.path);
    fs.readFile(req.files.thumbnail.path, function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log("file read success");
            //    console.log("image data-"+data);
            var params={
                Bucket:"mini-linkedin",
                Key: req.files.thumbnail.name,
                ContentType: 'image/jpg',
                CacheControl: 'max-age=31536000',
                Body:data
            };
            console.log("s3 put");
            s3.putObject(params, function(err, data) {
                if (err) {console.log(err, err.stack); }// an error occurred
                else {    console.log("upload data="+util.inspect(data, false, null));
                    resonsedata=data;
                    var params = {Bucket: 'photoshareappcmpe277', Key: req.files.thumbnail.name};
                    url = s3.getSignedUrl('getObject', params);
                    console.log('The URL is', url);}          // successful response
                console.log("url==>"+url);
                var newPhoto = new Photo ({
                    photoId:photo_id,
                    albumId: req.params.album_id,
                    userId: req.params.user_id,
                    photoName: req.body.photoName,
                    photoUrl: url,
                    location: req.body.location,
                    metadata: req.body.metadata,
                    public: req.body.public
                });
                fs.unlink(req.files.thumbnail.path, function (err) {
                    if (err) throw err;
                    console.log('successfully deleted');
                });
                newPhoto.save(function(err,newPhoto){
                    if (err){
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).send(err);
                        console.log(err);
                    }
                    else {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(201).send(newPhoto);
                        console.log("Success: ");
                    }
                })

            });
        }
    });
});

router.get('/:user_id/album/:album_id/photos',function (req, res) { // get all photos in an album
    Photo.find({userId:req.params.user_id, albumId: req.params.album_id}, function(err, foundAlbum){
        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send("Cannot find user with that id");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(foundAlbum);
        }
    });
});

router.get('/:user_id/album/:album_id/photo/:photo_id',function (req, res) { // get photo by id
    Photo.findOne({userId:req.params.user_id, albumId: req.params.album_id, photoId: req.params.photo_id}, function (err, foundPhoto) {
        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send("Cannot find user with that id");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(foundPhoto);
        }
    });
});

router.delete('/:user_id/album/:album_id/photo/:photo_id',function (req, res) { // delete photo by id
    Photo.remove({userId:req.params.user_id, albumId: req.params.album_id, photoId: req.params.photo_id}, function (err, foundPhoto) {
        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send("Cannot delete photo");
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(foundPhoto);
        }
    });
});

router.get('/:user_id/search', function(req, res) { // search album name or photo (for photo, can search across metadata or photoname
    var option = req.query.option;
    var query=req.query.q;
    if (option!=null && query!=null){
        if(option=="photo") {
            console.log("search for " + option + " " + query);
            Photo.find({userId:req.params.user_id,'$or': [{metadata: {$regex: new RegExp('^' + query, 'i')}}, {location: {$regex: new RegExp('^' + query, 'i')}}, {photoName: {$regex: new RegExp('^' + query, 'i')}}]},
                function (err, foundPhoto) {
                    if (err) {
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).send("Cannot find");
                    }
                    else {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).send(foundPhoto);
                    }
                })
        }
        if(option=="album") {
            console.log("search for " + option + " " + query);
            User.find(
                {userId:req.params.user_id, 'album.albumName':{$regex: new RegExp('^' + query, 'i')}},{'album.$': 1},
                function (err, foundAlbum) {
                    if (err) {
                        console.log(err);
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).send("Cannot find");
                    }
                    else {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).send(foundAlbum);
                    }
                })
        }
    }
});

module.exports = router;