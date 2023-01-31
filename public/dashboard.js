var selectedRoomNo = "";
var userState = user.state;
var userRoomNumber = user.roomNumber;


if(userState == 2){
  document.querySelector("#currentRoomNumber").innerHTML = "Room Allotment in Progress";
}
if(userState == 3){
  document.querySelector("#currentRoomNumber").innerHTML = `Room Alloted : ${userRoomNumber}`;
}

if(user.fullName != undefined) document.querySelector("#fullname").value = user.fullName;
if(user.fatherName != undefined) document.querySelector("#fathername").value = user.fatherName;
if(user.motherName != undefined) document.querySelector("#mothername").value = user.motherName;
if(user.fullAddress != undefined) document.querySelector("#fulladdress").value = user.fullAddress;
if(user.department != undefined) document.querySelector("#department").value = user.department;
if(user.mobileNumber != undefined) document.querySelector("#mobileNo").value = user.mobileNumber;
if(user.email != undefined) document.querySelector("#email").value = user.email;
if(user.enrollmentNumber != undefined) document.querySelector("#enrollmentNo").value = user.enrollmentNumber;

function expandBlock(block){

  for(var i =1;i<51;i++)
 { const button = document.createElement("button");
    button.innerHTML = block+"-"+i;
    button.className = "btn btn-outline-success Button";
    button.id=block+"-"+i;
    document.getElementById("buttons"+block).appendChild(button);
    button.addEventListener("click", (e) => {
      selectedRoomNo = e.target.id;
      for(var i = 1; i < 51; i++){
        document.querySelector("#A-" + i).classList.remove("selectedButton");
        document.querySelector("#B-" + i).classList.remove("selectedButton");
        document.querySelector("#C-" + i).classList.remove("selectedButton");
        document.querySelector("#D-" + i).classList.remove("selectedButton");
      }
      e.target.classList.add("selectedButton");
      selectedRoomNo = e.target.id;
    });}
}
expandBlock('A')
expandBlock('B')
expandBlock('C')
expandBlock('D')


function selectedBlock(){
var option;

if(userState == 0) {
  document.getElementById("select").value = "none";
  alert("Please update your information first!")
}
if(userState == 2) {
  document.getElementById("select").value = "none";
  alert("Room Allotment in progress.");
}
if(userState == 3) {
  document.getElementById("select").value = "none";
  alert("Room already alloted.");
}

option = document.getElementById("select").value;

if(option!='none')
{
document.getElementById("buttonsA").style.display="none";
document.getElementById("buttonsB").style.display="none";
document.getElementById("buttonsC").style.display="none";
document.getElementById("buttonsD").style.display="none";
document.getElementById("buttons"+option).style.display="block";
}
else if(option==="none")
{
  document.getElementById("buttonsA").style.display="none";
  document.getElementById("buttonsB").style.display="none";
  document.getElementById("buttonsC").style.display="none";
  document.getElementById("buttonsD").style.display="none";
}
}

function checkValid(){
var valid = true;
var form = document.querySelector("#userInfoForm");
form.querySelectorAll('[required]').forEach((item) => {
    if(!item.value){
        valid = false;
        return valid;
    }
})
return valid;
}

const saveInfoBtn = document.getElementById("saveInfo");
saveInfoBtn.addEventListener("click", async () => {
if(checkValid()){
  saveInfoBtn.setAttribute("disabled", "");
  const config = {
      url: '/api/saveUserInfo',
      method: "post",
      data: {
          googleID: user.googleID,
          fullName: document.querySelector("#fullname").value,
          fathername: document.querySelector("#fathername").value,
          mothername: document.querySelector("#mothername").value,
          fulladdress: document.querySelector("#fulladdress").value,
          department: document.querySelector("#department").value,
          mobileNumber: document.querySelector("#mobileNo").value,
          email: document.querySelector("#email").value,
          enrollmentNumber: document.querySelector("#enrollmentNo").value,
      }
  }
  const res = await axios(config);
  const message = res.data;

  if(message.status == "OK") {
    alert("Information updated succesfully.");
    location.reload();
  }
  else alert("Updation Failed! Please try again later.");
  saveInfoBtn.removeAttribute("disabled");
}
})

const submitPreferenceButton = document.querySelector("#submitPreference");
submitPreferenceButton.addEventListener("click", async () => {
if(selectedRoomNo == ""){
  alert("Please select a Room First.");
  return;
}

submitPreferenceButton.setAttribute("disabled", "");
const config = {
  url: "/api/submitRoomPreference",
  method: "post",
  data: {
    googleID: user.googleID,
    selectedRoomNumber: selectedRoomNo
  }
}


const res = await axios(config);
const message = res.data;

if(message.status == "OK"){
  alert("Room preference submitted.");
  location.reload();
}
else alert("Unable to submit preference! Please try again later.");

submitPreferenceButton.removeAttribute("disabled");
})


for(var i = 0; i < roomInfo.length; i++){
var currentRoom = document.getElementById(roomInfo[i].roomNumber);
console.log(roomInfo[i]);
if(roomInfo[i].state == 1){
  currentRoom.classList.add("orange");
}
else if(roomInfo[i].state == 2){
  currentRoom.setAttribute("disabled", "");
}
}