const router = require("express").Router();
const Admin = require("../models/schema.js").AdminInfo;
  const verifyToken = require("../middleware/auth.js");
const authRoutes = require('./auth.js')

require("dotenv").config()



// Schema 
const User = require("../models/schema.js").UserInfo;
const Room = require("../models/schema.js").RoomInfo;
const pendingList = require("../models/schema.js").pendingList;



const { Cursor } = require("mongoose");

// Passport Middleware
const passport = require("passport");
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


// google auth
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://hostel-management-app-23.onrender.com/studentLoginSuccess",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  (accessToken, refreshToken, profile, done) => {
    const userData = profile._json;
    User.findOne({googleID: userData.sub}).then((user) => {
        if(user){
            done(null, user);
        }
        else{
            new User({
                googleID: userData.sub,
                profilePicture: userData.picture,
                roomNumber: "",
                state: 0
            }).save().then((user) => {
                done(null, user);
            });
        }
    });
  }
));

// Student Side

// Authentication Middleware

function isAuthenticated(req, res, next){
    if(req.user){
        next();
    }
    else{
        res.render("./studentLogin.ejs", {
            title: "Student Login"
        });
        // res.redirect('/');
    }
}
router.get('/',(req,res)=>{
    res.render('studentLogin',{
        title:'Login-Page'
       })
})
router.get("/", isAuthenticated, (req, res) => {
    res.redirect("/dashboard");
})

router.get('/dashboard', isAuthenticated, async (req,res)=>{
    var roomInfo = await Room.find({});
    roomInfo = JSON.stringify(roomInfo);
    res.render('dashboard',{
        title: 'Dashboard',
        user: JSON.stringify(req.user),
        roomInfo
    });
})

router.get("/studentLogin/googleAuth", passport.authenticate('google', { 
    scope: ['profile'],
    prompt: "select_account" 
}));

router.get("/studentLoginSuccess", passport.authenticate("google"), (req, res) => {
    res.redirect("/dashboard");
});


// router.get('/studentLogin',(req,res)=>{
//     res.render('studentLogin.ejs',{
//         title: 'Login',
//     });
// })
router.get("/studentLogout", (req, res) => {
    req.logout();
    req.session = null;
    res.redirect("/");
})
// studentLogin



async function updateUserInformation(userInfo){
    var response = true;
    var currentUser = await User.findOne({googleID: userInfo.googleID});

    currentUser.fullName = userInfo.fullName;
    currentUser.fatherName = userInfo.fathername;
    currentUser.motherName = userInfo.mothername;
    currentUser.fullAddress = userInfo.fulladdress;
    currentUser.department = userInfo.department;
    currentUser.mobileNumber = userInfo.mobileNumber;
    currentUser.email = userInfo.email;
    currentUser.enrollmentNumber = userInfo.enrollmentNumber;
    currentUser.state = 1;

    currentUser.save((err, res) => {
        if(err){
            response = false;
            console.log(err);
        }
    })

    return response;
}

router.post('/api/saveUserInfo', async (req, res) => {
    const response = await updateUserInformation(req.body);

    if(response){
        res.send({
            status: "OK"
        })
    }
    else{
        res.send({
            status: "FAILED"
        })
    }
})

async function updateRoomPreference(userInfo){
    var response = true;

    var currentUser = await User.findOne({googleID: userInfo.googleID});
    var currentRoom = await Room.findOne({roomNumber: userInfo.selectedRoomNumber});

    if(currentRoom == null){
        currentRoom = await new Room;
        currentRoom.roomNumber = userInfo.selectedRoomNumber;
        currentRoom.state = 1;
    }
    else{
        currentRoom.state = currentRoom.state + 1;
    }

    currentUser.state = 2;
    currentUser.roomNumber = userInfo.selectedRoomNumber;

    if(currentRoom.state == 1) currentRoom.student1 = currentUser.googleID;
    else if(currentRoom.state == 2) currentRoom.student2 = currentUser.googleID;

    pendingItem = new pendingList;
    pendingItem.googleID = userInfo.googleID;
    pendingItem.roomNumber = userInfo.selectedRoomNumber;

    pendingItem.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })

    currentUser.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })

    currentRoom.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })

    return response;
}

router.post('/api/submitRoomPreference', async (req, res) => {
    const response = await updateRoomPreference(req.body);

    if(response){
        res.send({
            status: "OK"
        })
    }
    else{
        res.send({
            status: "FAILED"
        })
    }
})


// admin Side
router.get('/auth/login',(req,res)=>{
    res.render('admin-login',{
     title:'AdminLogin'
    })
})

router.get("/logout", (req, res) => {
    res.cookie("token", "", {
      maxAge: 0
    });
    res.redirect("/auth/login");
  });

router.use("/auth", authRoutes);
 
router.get('/admin',verifyToken, async (req,res)=>{
    var roomInfo = await Room.find({});
    roomInfo = JSON.stringify(roomInfo);
    res.render('admin-dashboard',{
        title: 'admin-dashboard',
        roomInfo
    });
})

router.get('/applications',verifyToken, async(req,res)=>{
    var allItems = await pendingList.find({});
    allItems = JSON.stringify(allItems);
    res.render('applications',{
        title: 'applications',
        allItems
    });
})


async function getStudentInfo(googleID){

    const currentUser = await User.findOne({googleID});
    return currentUser;
}

router.post("/api/getStudentInformation", async (req, res) => {
    const userInfo = await getStudentInfo(req.body.googleID);

    res.send({
        status: "OK",
        roomNumber: userInfo.roomNumber,
        fullName: userInfo.fullName,
        fullAddress: userInfo.fullAddress,
        department: userInfo.department,
        enrollmentNumber: userInfo.enrollmentNumber,
        mobileNumber: userInfo.mobileNumber
    })
})

async function acceptStudent(googleID){
    var response = true;

    var currentUser = await User.findOne({googleID});

    var pendingItem = await pendingList.findOne({googleID});
    pendingItem.remove((err, res) => {
        if(err){
            response = false;
            return response;
        }
    });

    currentUser.state = 3;
    currentUser.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    });

    return response;
}

router.post("/api/acceptStudent", verifyToken,async (req, res) => {
    const response = await acceptStudent(req.body.googleID); 
    
    if(response) res.send({status: "OK"});
    else res.send({status: "FAILED"});
})


async function rejectStudent(googleID){
    const response = true;

    var currentUser = await User.findOne({googleID});
    currentUser.state = 1;
    
    var selectedRoom = currentUser.roomNumber;
    var currentRoom = await Room.findOne({roomNumber: selectedRoom});
    currentRoom.state = currentRoom.state - 1;

    var pendingItem = await pendingList.findOne({googleID});
    pendingItem.remove((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })

    currentUser.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })

    currentRoom.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })


    return response;
    router.get('/studentLogin',(req,res)=>{
        res.render('studentLogin.ejs',{
            title: 'Login',
        });
    })
}

router.post("/api/rejectStudent", verifyToken, async (req, res) => {
    const response = await rejectStudent(req.body.googleID); 
    
    if(response) res.send({status: "OK"});
    else res.send({status: "FAILED"});
})

async function removeStudent(googleID){
    var response = true;

    var currentUser = await User.findOne({googleID});
    currentUser.state = 1;

    var currentRoom = await Room.findOne({roomNumber: currentUser.roomNumber});
    currentRoom.state = currentRoom.state - 1;

    if(currentRoom.state == 1){
        if(currentRoom.student1 == googleID){
            currentRoom.student1 = currentRoom.student2;
        }
    }

    currentUser.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })

    currentRoom.save((err, res) => {
        if(err){
            response = false;
            return response;
        }
    })

    return response;
}

router.post("/api/removeStudent", verifyToken, async (req, res) => {
    const response = await removeStudent(req.body.googleID);

    if(response) res.send({status: "OK"});
    else res.send({status: "FAILED"});
})

router.post("/api/isPending",verifyToken, async (req, res) => {
    const googleID = req.body.googleID;
    const pendingItem = await pendingList.findOne({googleID});

    if(pendingItem == null){
        res.send({status: "OK", isPending: false});
    }
    else{
        res.send({status: "OK", isPending: true});
    }
})

module.exports=router;