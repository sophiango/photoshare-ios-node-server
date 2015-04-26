var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Photo = require('../models/photo');
var chance = require('chance').Chance();

//app.use(session({
//    secret: 'keyboard cat',
//    resave: true,
//    saveUninitialized: true
//}));

// when user successfully log in with facebook, it will hit this
router.post('/',function(req,res){
    User.count({userId:req.body.userId }, function (err, count){
        if(count <= 0){// user not exist ,create new user
            var newUser = new User ({
                userId : req.body.userId, // facebook id
                name : req.body.name,
                email: req.body.email,
                profilepicUrl: req.body.profilepicUrl,
                album: [{
                    albumId:"0", // default album
                    albumName: "Default" // createAt by default
                }]
            });
            console.log(newUser);
            newUser.save(function (err, newUser) {
                if (err){
                    res.status(404).send(err);
                }
                else {
                    res.status(201).send(newUser);
                }
            });
        }
    });
});

router.get('/:user_id', function (req, res) { // get user profile by id
    var user_id = req.params.user_id;
    if (user_id < 0) {
        res.status(404).send('Invalid user id');
    }
    User.findOne({userId:user_id},function(err,foundUser){
        if (err || foundUser===null) {
            res.status(404).send(err);
        }
        else {
            res.status(200).send(foundUser);
        }
    });
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
                    res.status(400).send("Cannot save album");
                }
                else{
                    res.status(200).send("Successfully added album " + foundUser);
                }
            });
        }
    });
});

router.get('/:user_id/album/:album_id',function (req, res) { // get album by id
    User.findOne({userId:req.params.user_id, 'album.albumId': req.params.album_id},{'album.$': 1}, function (err, result) {
        if (err) {
            res.status(404).send("Cannot find user or album with given id" + err);
        }
        else {
            res.status(200).send(result);
        }
    });
});

router.delete('/:user_id/album/:album_id',function (req, res) { // delete album by id
    User.update({userId:req.params.user_id},
        {$pull:{album:{albumId:req.params.album_id}}},
        {safe:true},
        function (err, result) {
        if (err) {
            res.status(404).send("Cannot find user or album with given id" + err);
        }
        else {
            res.status(204).send(result);
        }
    });
});

//router.put('/:user_id/album/:album_id',function (req, res) { // edit album by id
//    User.findOne({userId:req.params.user_id, 'album.albumId': req.params.album_id},{'album.$': 1}, function (err, foundAlbum) {
//        if (err) {
//            res.status(404).send("Cannot find user or album with given id" + err);
//        }
//        else {
//            User.update({'album.albumId': req.params.album_id},
//                {'$set': {
//                    albumName: req.body.albumName
//                }
//            }, function (err, albumAffected) {
//                if (err) {
//                    res.status(404).send("Error updating" + err);
//                }
//                else {
//                    res.status(200).send("Successfully update album " + albumAffected);
//                }
//            });
//        }
//    });
//});

router.post('/:user_id/album/:album_id/photo',function (req, res) { // create new photo
    var photo_id = chance.natural({min: 1, max: 1000}).toString();
    var newPhoto = new Photo ({
        photoId:photo_id,
        albumId: req.params.album_id,
        userId: req.params.user_id,
        photoName: req.params.photoName,
        photoUrl: req.body.photoUrl,
        tinyUrl: req.body.tinyUrl,
        metadata: req.body.metadata,
        public: req.body.public
    });
    newPhoto.save(function(err,newPhoto){
        if (err){
            res.status(404).send(err);
        }
        else {
            res.status(201).send(newPhoto);
        }
    })
});

router.get('/:user_id/album/:album_id/photos',function (req, res) { // get all photos in an album
    Photo.find({userId:req.params.user_id, albumId: req.params.album_id}, function(err, foundAlbum){
        if (err) {
            res.status(404).send("Cannot find user with that id");
        }
        else {
            res.status(200).send(foundAlbum);
        }
    });
});

router.get('/:user_id/album/:album_id/photo/:photo_id',function (req, res) { // get photo by id
    Photo.findOne({userId:req.params.user_id, albumId: req.params.album_id, photoId: req.params.photo_id}, function (err, foundPhoto) {
        if (err) {
            res.status(404).send("Cannot find user with that id");
        }
        else {
            res.status(200).send(foundPhoto);
        }
    });
});

router.delete('/:user_id/album/:album_id/photo/:photo_id',function (req, res) { // delete photo by id
    Photo.remove({userId:req.params.user_id, albumId: req.params.album_id, photoId: req.params.photo_id}, function (err, foundPhoto) {
        if (err) {
            res.status(404).send("Cannot delete photo");
        }
        else {
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
            Photo.find({userId:req.params.user_id,'$or': [{metadata: {'$in': [query]}}, {photoName: {$regex: new RegExp('^' + query, 'i')}}]},
                function (err, foundPhoto) {
                if (err) {
                    console.log(err);
                    res.status(400).send("Cannot find");
                }
                else {
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
                    res.status(400).send("Cannot find");
                }
                else {
                    res.status(200).send(foundAlbum);
                }
            })
        }
    }
});


module.exports = router;
