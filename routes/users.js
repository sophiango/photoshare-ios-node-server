var express = require('express');
var router = express.Router();
var User = require('../models/user');

// when user successfully log in with facebook, it will hit this
router.post('/',function(req,res){
    var newUser = new User ({
        userId : req.body.userId, // facebook id
        name : req.body.name,
        email: req.body.email,
        profilepicUrl: req.body.profilepicUrl,
        album: [{
            albumId:00000, // default album
            albumName: "Default", // createAt by default
            photos: null
        }]
    });
    newUser.save(function (err, newUser) {
        if (err){
            res.status(404).send(err);
        }
        else {
            res.status(200).send(newUser);
        }
    });
});


//router.get('/:user_id', function (req, res) {
//    var user_id = req.params.user_id;
//    if (user_id < 0) {
//        res.status(404).send('Invalid company id');
//    }
//    User.findOne({userId:user_id},function(err,foundUser){
//        if (err || foundUser===null) {
//            console.log(" router get userId"+err);
//            res.render('index',{
//                message:null,
//                err: 'Cannot find user'
//            })
//        }
//        else {
//            console.log(foundUser);
//            res.render('user',{
//                User: foundUser});
//        }
//    });
//});
//
//router.get('/:user_id/edit_profile',function (req, res) {
//    User.findOne({userId:req.params.user_id}, function (err, foundUser) {
//        if (err) {
//            console.log("Error in finding user "+err);
//            if (err) {
//                res.render('index',{
//                    message:null,
//                    err: 'Cannot find user'
//                });
//            }
//        }
//        else {
//            console.log("User.imageUrl "+foundUser.imageUrl);
//            console.log("User.headline "+foundUser.headline);
//            res.render('edit_profile',{
//                user_id: req.params.user_id,User:foundUser
//            });
//        }
//    });
//
//});
//
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
//router.post('/:user_id/exp',function (req, res) {
//    var userId=req.params.user_id;
//    User.findOne({userId:userId},function(err,foundUser) {
//        if (err) {
//            console.log(err);
//            res.render('index',{
//                message:null,
//                err: 'Cannot find user'
//            })
//        }
//        else {
//            var cnt= foundUser.experience.length;
//            console.log("Reached add ");
//            console.log("Cnt "+cnt);
//            foundUser.experience.push({
//                position: req.body.inputPosition,
//                company: req.body.inputCompany,
//                from: req.body.inputFrom,
//                to: req.body.inputTo,
//                description: req.body.inputDesc
//            });
//            foundUser.save(function (err) {
//                if (err) {
//                    console.log(err);
//                    res.render('add_new_exp',{
//                        user_id: User.userId,
//                        message:null,
//                        err: "Cannot add new experience"
//                    })
//                }
//                else{
//                    /* res.render('add_new_exp',{
//                     user_id: User.userId,
//                     message:"Successfully added an experience. You can add more experience or go back to your profile",
//                     err: null
//                     })*/
//                    res.redirect('/user/'+userId);
//                }
//            });
//        }
//    });
//});
//
//router.get('/:user_id/exp',function (req, res) {
//    res.render('add_new_exp',{
//        user_id: req.params.user_id,
//        message:null,
//        err:null
//    })
//});
//
//router.get('/:user_id/edit_exp',function (req, res) {
//    User.findOne({userId:req.params.user_id},function(err,foundUser){
//        if (err) {
//            console.log(err);
//            res.render('index',{
//                message:null,
//                err: 'Cannot find user'
//            })
//        }
//        else {
//            if(foundUser.experience.length>0) {
//                res.render('edit_exp', {
//                    user_id: req.params.user_id,
//                    User: foundUser
//                })
//            }
//            else{
//                res.render('add_new_exp', {
//                    user_id: req.params.user_id,
//                    message: null,
//                    err: null
//                })
//            }
//        }
//    });
//});
//
//router.post('/:user_id/edit_exp', function (req, res) {
//    var user_id = req.params.user_id;
//    console.log("req "+req.body);
//    return User.findOne({userId: req.params.user_id}, function (err, foundUser) {
//        foundUser.experience[0].position= req.body.inputPosition;
//        foundUser.experience[0].company= req.body.inputCompany;
//        foundUser.experience[0].from= req.body.inputFrom;
//        foundUser.experience[0].to= req.body.inputTo;
//        foundUser.experience[0].description= req.body.inputDesc;
//        return foundUser.save(function (err) {
//            if (!err) {
//                /* res.render('user', {
//                 connection_count: '100',
//                 User: foundUser
//                 });*/
//                res.redirect('/user/'+user_id);
//            } else {
//                console.log(err);
//            }
//        });
//    });
//});
//
//router.post('/:user_id/edu',function (req, res) {
//    var userId=req.params.user_id;
//    User.findOne({userId:userId},function(err,foundUser) {
//        if (err) {
//            console.log(err);
//            res.render('index',{
//                message:null,
//                err: 'Cannot find user'
//            })
//        }
//        else {
//            var cnt= foundUser.education.length;
//            console.log("Reached add ");
//            console.log("Cnt "+cnt);
//            foundUser.education.push({
//                id:cnt+1,
//                institution: req.body.inputSchool,
//                degree: req.body.inputDegree,
//                fromYear: req.body.inputFrom,
//                toYear: req.body.inputTo
//            });
//            foundUser.save(function (err) {
//                if (err) {
//                    res.render('add_new_edu',{
//                        user_id: User.userId,
//                        message:null,
//                        err: "Cannot add new institution"
//                    })
//
//
//                }
//                else{
//                    /*res.render('add_new_edu',{
//                     user_id: User.userId,
//                     message:"Successfully added an institution. You can add more institution or go back to your profile",
//                     err: null
//                     })*/
//                    res.redirect('/user/'+userId);
//                }
//            });
//        }
//    });
//});
//
//router.get('/:user_id/edu',function (req, res) {
//    res.render('add_new_edu',{
//        user_id: req.params.user_id,
//        message:null,
//        err:null
//    })
//});
//
//router.get('/:user_id/edit_edu',function (req, res) {
//    User.findOne({userId:req.params.user_id},function(err,foundUser){
//        if (err) {
//            console.log(" router get edit_edu "+err);
//            res.render('index',{
//                message:null,
//                err: 'Cannot find user'
//            })
//        }
//        else {
//            if(foundUser.education.length>0) {
//                res.render('edit_edu', {
//                    user_id: req.params.user_id,
//                    User: foundUser
//                })
//            }
//            else{
//                res.render('add_new_edu', {
//                    user_id: req.params.user_id,
//                    message: null,
//                    err: null
//                })
//            }
//        }
//    });
//});
//
//router.post('/:user_id/edit_edu', function (req, res) {
//    console.log("Re body "+req.body.inputDegree);
//    var user_id = req.params.user_id;
//    User.findOne({userId: req.params.user_id}, function (err, foundUser) {
//        foundUser.education[0].institution= req.body.inputSchool;
//        foundUser.education[0].degree= req.body.inputDegree;
//        foundUser.education[0].fromYear= req.body.inputFrom;
//        foundUser.education[0].toYear= req.body.inputTo;
//        foundUser.save(function (err) {
//            if (!err) {
//                res.redirect('/user/'+user_id);
//
//            } else {
//                console.log(err);
//                res.render('index',{
//                    message:null,
//                    err: 'Cannot edit education'
//                })
//            }
//        });
//    });
//});
//
//router.post('/:user_id/del', function (req, res) {
//    var user_id = req.params.user_id;
//    if (user_id < 0){
//        res.status(404).send('Invalid company id or job id');
//    }
//    User.remove({userId:user_id},function(err) {
//        if (err) {
//            console.log(err);
//            res.render('index',{
//                message:null,
//                err: 'Cannot delete user'
//            })
//        }
//        else {
//            res.render('index',{
//                message:"Successfully delete user profile",
//                err: null
//            })
//        };
//    })
//});

module.exports = router;
