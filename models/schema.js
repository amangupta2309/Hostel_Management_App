const mongoose = require("mongoose");

const userInfoSchema = new mongoose.Schema({
    googleID: String,
    fullName: String,
    fatherName: String,
    motherName: String,
    fullAddress: String,
    department: String,
    mobileNumber: String,
    email: String,
    enrollmentNumber: String,
    state: Number,
    roomNumber: String,
    profilePicture: String
});
const UserInfo = new mongoose.model("User", userInfoSchema);

const roomSchema = new mongoose.Schema({
    roomNumber: String,
    state: Number,
    student1: String,
    student2: String
})
const RoomInfo = new mongoose.model("Room",roomSchema);

const PendingListSchema = new mongoose.Schema({
    googleID: String,
    roomNumber: String
})
const pendingList = new mongoose.model("PendingItem", PendingListSchema);

const AdminSchema = new mongoose.Schema({
    user: String,
    password: String
})
const AdminInfo = new mongoose.model('admin',AdminSchema);

module.exports = {
    UserInfo,
    RoomInfo,
    pendingList,
    AdminInfo
};

