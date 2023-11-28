import { showAlert } from "./alert.js";

var obj;
if (document.cookie) {
  obj = JSON.parse(document.cookie.substring(6));
} else {
  obj = JSON.parse('{}');
}

const userApplication = async (id) => {
  try {
    const res = await axios({
      method: "GET",
      url: 'http://localhost:4001/api/v1/application/user/' + id
      
    });
    displayApplication(res.data)
  } catch (error) {
    console.log("Error fetching user posted leave application: ", error);
    return [];
  }
}



const id = obj._id;
userApplication(id);

const displayApplication =  (applications)=>{
    var app = applications.data.application1;
    const tableBody = document.getElementById('userApplicationTable')
    let serialNumber = 1
    app.forEach(application=>{
        const row = tableBody.insertRow();
        const td = [];
        for(var i = 0; i<7; i++){
            td[i] = row.insertCell(i);
        }

        //populate the table rows with user data
        td[0].innerHTML = td[0].innerHTML = serialNumber;
        serialNumber++;
        td[1].innerHTML = application._id;
        td[2].innerHTML = application.leaveCategory;
        const leavingDate = new Date(application.leavingDate).toISOString().split('T')[0];
        td[3].innerHTML = leavingDate;
        const reportingDate = new Date(application.reportingDate).toISOString().split('T')[0];
        td[4].innerHTML = reportingDate;
        td[5].innerHTML = application.status;

          serialNumber++;
  
          // Add edit and delete icons in td[7]
        //   const editLink = document.createElement('a');
        //   editLink.classList.add('edit-link');
        //   editLink.href = '/editApplication';
        //   editLink.setAttribute('role', 'button');
        //   editLink.setAttribute('aria-label', 'Edit this application');
        //   const editIcon = document.createElement('i');
        //   editIcon.classList.add('fas', 'fa-edit');
        //   editIcon.setAttribute('aria-hidden', 'true');
        //   editLink.appendChild(editIcon);
  
          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-button');
          deleteButton.setAttribute('type', 'submit');
          deleteButton.setAttribute('role', 'button');
          deleteButton.setAttribute('aria-label', 'Delete this application');
          const deleteIcon = document.createElement('i');
          deleteIcon.classList.add('fas', 'fa-trash-alt');
          deleteIcon.setAttribute('aria-hidden', 'true');
          deleteButton.appendChild(deleteIcon);
  
        //   td[6].appendChild(editLink);
          td[6].appendChild(deleteButton);



           // Attach click event listeners for delete and edit buttons
           editLink.addEventListener("click",function(){getRId(application._id)})
          //  editLink.addEventListener('click', ()=>updateApplication(application._id, application.data))
          deleteButton.addEventListener('click', ()=>deleteApplication(application._id))

          

    }); 
}

export const deleteApplication = async (id) => {
  // Display a confirmation dialog
  const userConfirmation = confirm("Are you sure you want to delete this application?");
  
  // Check user's confirmation
  if (userConfirmation) {
      try {
          const res = await axios({
              method: "DELETE",
              url: `http://localhost:4001/api/v1/application/${id}`,
          });
          if (res.data.status === "success") {
              showAlert("success", "Leave Application Deleted!");
              window.setTimeout(() => {
                  location.reload(true);
              }, 1000);
          }
      } catch (err) {
          let message =
              typeof err.response !== "undefined"
                  ? err.response.data.message
                  : err.message;
          showAlert("error", message);
      }
  } else {
      // User clicked 'Cancel' on the confirmation dialog
      showAlert("info", "Deletion canceled by user.");
  }
};




// UPDATES APPLICATION
var applicationId = localStorage.getItem("variable");
console.log(applicationId);
localStorage.removeItem("variable");

export const updateApplication = async (applicationId, data) => {
    try {
        const res = await axios({
            method: "PATCH", // Change the method to PATCH or PUT
            url: `http://localhost:4001/api/v1/application/${applicationId}`, // Include the application ID in the URL
            data,
        });
        if (res.data.status === "success") {
            showAlert("success", "Leave Application Successfully Updated!!!"); // Update the success message
            window.setTimeout(() => {
                location.reload();
            }, 2000);
        }
        console.log(res);
    } catch (err) {
        let message = typeof err.message !== 'undefined'
            ? err.response.data.message
            : err.message;
        showAlert('error', "Error: Cannot Update the Leave Application", message); // Update the error message
    }
};




document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData();
  // Append common fields
  form.append('leavingDate', document.getElementById('leavingDate').value);
  form.append('reportingDate', document.getElementById('reportingDate').value);
  form.append('course', document.getElementById('course').value);
  form.append('leaveCategory', document.getElementById('leaveCategory').value);

  const leaveCategory = document.getElementById('leaveCategory').value;

  switch (leaveCategory) {
      case 'shortTerm':
          form.append('shortTermReason', document.getElementById('shortTermReason').value);
          break;
      case 'longTerm':
          form.append('file', document.getElementById('longTermFile').files[0]);
          break;
      case 'emergency':
          form.append('emergencySickPersonName', document.getElementById('sickPersonName').value);
          break;
      case 'travel':
          form.append('file', document.getElementById('travelFile').files[0]);
          break;
      default:
          console.log('Unknown or unhandled leave category');
          break;
  }

  form.append('user', obj._id);
  console.log(form);
  // Call the updateApplication function with the application ID and the form data
  updateApplication(applicationId, form);
});
