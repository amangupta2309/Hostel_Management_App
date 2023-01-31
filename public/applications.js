async function loadData(){  
    if(allItems.length == 0){
        var newItem = document.createElement("h1");
        newItem.innerHTML = "No Pending Applications";
        newItem.style.marginTop = "20px";
        newItem.style.textAlign = "center";
        document.querySelector("body").appendChild(newItem);
    }  

    for(var i = 0; i < allItems.length; i++){
        var newItem = document.createElement("div");
        newItem.id = `item-${i}`;
        newItem.style.padding = "0"
        newItem.style.margin = "10px 0 10px 0";
        newItem.style.background = "white";


        const config = {
            url: "/api/getStudentInformation",
            method: "post",
            data: {
                googleID: allItems[i].googleID
            }
        }

        const res = await axios(config);
        const message = res.data;

        if(message.status != "OK"){
            alert("Server Busy! Please try again later.");
            return;
        }

        newItem.innerHTML = `
                                <form class="application">
                                <div>Room Requested</div>
                                <div class="RoomRequested">${message.roomNumber}</div>
                                <div>Student name</div>
                                <div class="Name">${message.fullName}</div>
                                <div>Address</div>
                                <div class="Address">${message.fullAddress}</div>
                                <div>Department</div>
                                <div class="Department">${message.department}</div>
                                <div>EnrollmentNo</div>
                                <div class="EnrollmentNo">${message.enrollmentNumber}</div>
                                <div>Mobile Number</div>
                                <div class="MobileNumber">${message.mobileNumber}</div>
                                <button type="button" class="btn btn-success Accept" id="accept-${i}">Accept</button>
                                <button type="button" class="btn btn-danger Reject" id="reject-${i}">Reject</button>
                                </form>
                            `
        await document.querySelector("body").appendChild(newItem);

        const currentReject = `reject-${i}`;
        const currentAccept = `accept-${i}`;
        const googleID = allItems[i].googleID;
        const serialNumber = `#item-${i}`;

        document.getElementById(currentReject).addEventListener("click", async () => {
            const config = {
                url: "/api/rejectStudent",
                method: "post",
                data:{
                    googleID
                }
            }

            const res = await axios(config);
            const message = res.data;

            if(message.status != "OK"){
                alert("Something went wrong! Please try again later.");
                return;
            }

            location.reload();
        })

        document.getElementById(currentAccept).addEventListener("click", async () => {
            const config = {
                url: "/api/acceptStudent",
                method: "post",
                data: {
                    googleID
                }
            }

            const res = await axios(config);
            const message = res.data;

            if(message.status != "OK"){
                alert("Something went wrong! Please try again later.");
                return;
            }

            location.reload();
        })
    }
}

loadData();