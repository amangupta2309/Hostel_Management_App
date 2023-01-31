CreatTable(['Room No.', 'Student1', 'Student2',],'A')
CreatTable(['Room No.', 'Student1', 'Student2',],'B')
CreatTable(['Room No.', 'Student1', 'Student2',],'C')
CreatTable(['Room No.', 'Student1', 'Student2',],'D')

function CreatTable(data,block) {
var table;
var thead;
var tr;
var th;
var tbody;

tablearea = document.getElementById('ShowDataID'+block);
table = document.createElement('table');
table.id = "ContactsTable";
thead = document.createElement('thead');
tr = document.createElement('tr');
tbody = document.createElement('tbody');
table.style.width = "100%";

//create columns FirstName,LastName,Emails
for (var i = 0; i < data.length; i++) {
   var headerTxt = document.createTextNode(data[i]);
   th = document.createElement('th');
   th.appendChild(headerTxt);
   tr.appendChild(th);
   thead.appendChild(tr);
}
table.appendChild(thead);

//create rows and addind to table

for (var i = 1; i <= 50; i++) {
   tr = document.createElement('tr');
   tr.appendChild(document.createElement('td'));
   tr.appendChild(document.createElement('td'));
   tr.appendChild(document.createElement('td'));
   tr.cells[0].innerHTML = block+"-"+i.toString();

   tr.cells[1].innerHTML = `<t id="${block}-${i}-1">---</t>`;
   tr.cells[1].firstChild.style.cursor="pointer"
   tr.cells[2].innerHTML = `<t id="${block}-${i}-2">---</t>`
   tr.cells[2].firstChild.style.cursor="pointer"

   tbody.appendChild(tr);
   table.appendChild(tbody);
}
   document.getElementById("TablePagingArea"+block).appendChild(table);
//return table;
}

function selectedBlock(){
        document.getElementById("TablePagingAreaA").style.display="none";
        document.getElementById("TablePagingAreaB").style.display="none";
        document.getElementById("TablePagingAreaC").style.display="none";
        document.getElementById("TablePagingAreaD").style.display="none";
        const option = document.getElementById("select").value;
        if(option==="A")
        document.getElementById("TablePagingAreaA").style.display="block";
        else if(option==="B")
        document.getElementById("TablePagingAreaB").style.display="block";
        else if(option=="C")
        document.getElementById("TablePagingAreaC").style.display="block";
        else if(option==='D')
        document.getElementById("TablePagingAreaD").style.display="block";
        else if(option==="none")
        {

        }
}

updateTable();
var currentlyShowingStudent;

async function updateTable(){
   for(var i = 0; i < roomInfo.length; i++){
      for(var j = 1; j <= roomInfo[i].state; j++){
         const currentStudent = document.getElementById(`${roomInfo[i].roomNumber}-${j}`);
         
         var googleID;
         if(j == 1) googleID = roomInfo[i].student1;
         else if(j == 2) googleID = roomInfo[i].student2;

         var config = {
            url: '/api/isPending',
            method: 'post',
            data: {
               googleID
            }
         }

         var res = await axios(config);
         message = res.data;

         if(message.status != "OK"){
            alert("Something went wrong! Please try again later.");
            return;
         }


         if(message.isPending == false){
            config = {
               url: '/api/getStudentInformation',
               method: 'post',
               data: {
                  googleID
               }
            }

            res = await axios(config);
            message = res.data;

            if(message.status != "OK"){
               alert("Something went wrong! Please try again later.");
               return;
            }

            const fullName = message.fullName;
            const department = message.department;
            const enrollmentNumber = message.enrollmentNumber;
            const mobileNumber = message.mobileNumber;

            currentStudent.innerHTML = fullName;

            const tempGoogleID = googleID;
            currentStudent.addEventListener("click", () => {
               currentlyShowingStudent = tempGoogleID;
               document.querySelector("#infoModalBody").innerHTML = `
                                                                        Name : ${fullName}<br>
                                                                        Department : ${department}<br>
                                                                        Enrollment Number : ${enrollmentNumber}<br>
                                                                        Mobile Number : ${mobileNumber}<br>
                                                                     `
               $("#exampleModalCenter").modal("show");
            })
         }
      }
   }
}

document.querySelector("#modalRemoveStudent").addEventListener("click", async () => {
   const config = {
      url: "/api/removeStudent",
      method: "post",
      data: {
         googleID: currentlyShowingStudent
      }
   }

   const res = await axios(config);
   const message = res.data;

   if(message.status != "OK"){
      alert("Something went wrong! Please try again later.");
      return;
   }

   location.reload();
   $("#exampleModalCenter").modal("hide");
})