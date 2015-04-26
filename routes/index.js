var express = require('express');
var router = express.Router();
var Photo = require('../models/photo');

// search?option=meta&q=something
//router.get('/search', function(req, res) {
//    var option=req.query.option;
//    var query=req.query.q;
//    if (option!==null && query!=null){
//        if(option == "meta"){
//            console.log("search for " + option + " " + query);
//            Photo.find({'$or':[{metadata: {'$in':[query]}},{photoName: {$regex: new RegExp('^' + query, 'i')}}]},{public: true},function(err,foundPhoto){
//                console.log(foundPhoto);
//                if (err) {
//                    console.log(err);
//                    res.status(400).send("Cannot find");
//                }
//                else {
//                    res.status(200).send(foundPhoto);
//                }})
//        }
//        if(option == "name"){
//            console.log("search for " + option + " " + query);
//            Photo.find({photoName: {$regex: new RegExp('^' + query, 'i')}},{public: true},function(err,foundPhoto){
//                console.log(foundPhoto);
//                if (err) {
//                    console.log(err);
//                    res.status(400).send("Cannot find");
//                }
//                else {
//                    res.status(200).send(foundPhoto);
//                }})
//        }
//    }
//});


router.get('/search', function(req, res) { // can search across metadata and photoname at the same time
    var query=req.query.q;
    if (query!=null){
            console.log("search for " + query);
            Photo.find({'$or':[{metadata: {'$in':[query]}},{photoName: {$regex: new RegExp('^' + query, 'i')}}]},{public: true},function(err,foundPhoto){
                console.log(foundPhoto);
                if (err) {
                    console.log(err);
                    res.status(400).send("Cannot find");
                }
                else {
                    res.status(200).send(foundPhoto);
                }})
    }
});

router.get('/photos',function (req, res) { // public access for all photos that marked as public
    Photo.find({public:true}, function (err, foundPhoto) {
        if (err) {
            res.status(404).send("Cannot find user with that id");
        }
        else {
            res.status(200).send(foundPhoto);
        }
    });
});

//router.post('/login', function(req, res) {
//    console.log('in login');
//    console.log(req.body.userId);
//    console.log(req.body.email);
//    console.log(req.body.accessToken);
//    sessForValidation=req.session;
//    sessForValidation.email=req.body.email;
//
//    //var hash = bcrypt.hashSync(req.body.inputSchool);
//
//    sessForValidation.pswd=req.body.inputSchool;
//
//    if(req.body.inlineRadioOptions=='option1')
//    {
//        sessForValidation.type='Jb';
//    }
//    else
//    {
//        sessForValidation.type='C';
//    }
//
//
//    //call checkforvalidation
//    CheckInRds(function(user) {
//
//        console.log(user);
//        //console.log(user.length);
//        if(user!==0) // user exists
//        {
//            console.log('I am userId'+user[0].id);
//            sessForValidation.id=user[0].id; // setting id in session field
//            req.session.MyID=user[0].id;
//            console.log('i am the session key' + req.session.MyID);
//            //req.session.afterLogin=sessForValidation;
//            if(sessForValidation.type=='Jb'){ //user if of job applicant type
//                console.log('hi i am in here');
//                User.findOne({userId:user[0].id},function(err,foundUser){
//                    if (err||foundUser==null) {
//                        console.log(err);
//
//                        res.render('index',{
//                            message:null,
//                            err: 'Cannot find user'
//                        });
//                    }
//                    else {
//                        console.log('in the else');
//                        console.log('printing user'+foundUser);
//                        res.redirect('/user/'+user[0].id+'/home');
//
//                    }
//                });
//            }
//            else{ // user is of type company
//                Company.findOne({companyId:user[0].id},function(err,foundCompany){
//                    if (err||foundCompany==null) {
//                        console.log(err);
//                        //res.redirect('/login');
//                        res.render('index',{
//                            message:null,
//                            err: 'Cannot find company'
//                        })
//                    }
//                    else {
//                        res.redirect('/company/'+user[0].id+'/home');
//
//                    }
//                });
//
//            }
//        }
//        else{
//            //res.redirect('/login');
//            res.render('index',{
//                message:null,
//                err: 'Cannot find you!'
//            });
//        }
//
//
//    });
//    //
//
//});

module.exports = router;
