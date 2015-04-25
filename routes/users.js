var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Photo = require('../models/photo');
var chance = require('chance').Chance();

// when user successfully log in with facebook, it will hit this
router.post('/',function(req,res){
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
});

router.get('/:user_id', function (req, res) {
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

router.post('/:user_id/album',function (req, res) {
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

router.post('/:user_id/album/:album_id/photo',function (req, res) {
    var photo_id = chance.natural({min: 1, max: 1000}).toString();
    var newPhoto = new Photo ({
        photoId:photo_id,
        albumId: req.params.album_id,
        userId: req.params.user_id,
        photoUrl: req.body.photoUrl,
        tinyUrl: req.body.tinyUrl,
        metadata: req.body.metadata,
        public: req.body.public
    })
    newPhoto.save(function(err,newPhoto){
        if (err){
            res.status(404).send(err);
        }
        else {
            res.status(201).send(newPhoto);
        }
    })
});

router.get('/:user_id/album/:album_id/photo/:photo_id',function (req, res) {
    var photo_id = chance.natural({min: 1, max: 100000}).toString();
    Photo.findOne({userId:req.params.user_id, 'albumId': req.params.album_id}, function (err, foundAlbum) {
        if (err) {
            res.status(404).send("Cannot find user with that id");
        }
        else {
            console.log(foundAlbum);
            foundAlbum.push({
                photoId:photo_id,
                photoUrl: req.body.photoUrl,
                tinyUrl: req.body.tinyUrl,
                metadata: req.body.metadata
            });
            foundAlbum.save(function (err) {
                if (err) {
                    res.status(400).send("Cannot save album");
                }
                else{
                    res.status(200).send("Successfully added album " + foundAlbum);
                }
            });
        }
    });
});

//router.post('/:user_id/edit_profile',myMulter, function (req, res) {
//    var user_id = req.params.user_id;
//    var link='';
//    console.log("req.files.imageUrl "+req.files.imageUrl);
//    console.log("req.body.imageUrlHidden "+req.body.imageUrlHidden);
//    console.log("req.body.headline "+req.body.headline);
//    //  if (req.body.imageUrlHidden)  {link=req.body.imageUrlHidden}
//    //else{
//    if (req.files.imageUrl){
//        console.log(" file "+req.files.imageUrl.name);
//        var file_name = req.files.imageUrl.name;
//        /*  if (file_name.type != 'image/png' && file_name.type != 'image/jpeg'){
//         console.log('Not image file');
//         return res.redirect('/user/'+user_id+'/edit_profile');
//         }*/
//        var upload_dir = ('./uploads/'+ file_name);
//        console.log(upload_dir);
//        var params = {
//            //localFile: "/Users/sophiango/Downloads/icon.jpg",
//            localFile: upload_dir,
//
//            s3Params: {
//                Bucket: "mini-linkedin",
//                Key: file_name
//                // other options supported by putObject, except Body and ContentLength.
//                // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
//            }
//        };
//        var uploader = client.uploadFile(params);
//        uploader.on('error', function(err) {
//            console.error("unable to upload:", err.stack);
//        });
//        uploader.on('progress', function() {
//            console.log("progress", uploader.progressMd5Amount,
//                uploader.progressAmount, uploader.progressTotal);
//        });
//        uploader.on('end', function() {
//            console.log("done uploading");
//        });
//
//        link = s3.getPublicUrl('mini-linkedin', file_name ,'us-east-1');
//        console.log(link);
//    }
//    else{link=req.body.imageUrlHidden;}
//
//    console.log("link "+link);
//    User.update({userId:user_id},{$set: {
//            firstName : req.body.firstName,
//            lastName : req.body.lastName,
//            headline : req.body.headline,
//            imageUrl : link
//        }},
//        function(err,foundUser){
//            if (err) {
//                console.log(err);
//                res.render('index',{
//                    message:null,
//                    err: 'Cannot edit user'
//                });
//            }
//            else{
//                User.findOne({userId:req.params.user_id}, function (err, foundUser) {
//                    if (err) {
//                        console.log(err);
//                        if (err) {
//                            res.render('index',{
//                                message:null,
//                                err: 'Cannot find user'
//                            });
//                        }
//                    }
//                    else {console.log("From edit profile");
//                        res.redirect('/user/'+user_id);
//                    }
//                });
//            }
//        });
//});
//
module.exports = router;
