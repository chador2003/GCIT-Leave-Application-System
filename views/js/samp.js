import { showAlert } from "./alert.js";
// Fetch user data from your API
const fetchApplications = async () => {
  try {
    const response = await axios.get("http://localhost:4001/api/v1/application");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching application data: ", error);
    return [];
  }
};

const initialize = async () => {
  const allapplications = await fetchApplications();
  console.log(allapplications)

  // Separate arrays for male and female users
  // const maleUsers = allapplications.filter(user => user.role_id === 0 && user.gender === 'male');
  // const femaleUsers = allapplications.filter(user => user.role_id === 0 && user.gender === 'female');

  // Function to create a table for a given set of users
  async function createTable(applications) {
    for (const application of applications.applications) {
      try {
        if (application.status === "pending") {
          const res = await axios.get(`http://localhost:4001/api/v1/users/${application.user._id}`);
          let user = res.data.data;
          console.log(user)
          let gender;
          user.gender === "male" ? gender = "Male" : gender = "Female";
          const tableBody = document.getElementById(`myTableBody${gender}`);

          const row = tableBody.insertRow();
          const td = [];
          for (var i = 0; i < 9; i++) {
            td[i] = row.insertCell(i);
          }

          // // Populate the table rows with user data
          const leaveDate = new Date(application.leavingDate);
          const formattedLeaveDate = `${(leaveDate.getMonth() + 1).toString().padStart(2, '0')}/${leaveDate.getDate().toString().padStart(2, '0')}/${leaveDate.getFullYear()}`;
          const ReportingDate = new Date(application.reportingDate);
          const formattedReportingDate = `${(ReportingDate.getMonth() + 1).toString().padStart(2, '0')}/${ReportingDate.getDate().toString().padStart(2, '0')}/${ReportingDate.getFullYear()}`;


          td[0].innerHTML = user.name;
          td[1].innerHTML = user.email;
          td[2].innerHTML = application.course;
          td[3].innerHTML = formattedLeaveDate;
          td[4].innerHTML = formattedReportingDate;
          td[5].innerHTML = application.leaveCategory;
          if (application.leaveCategory === "emergency") {
            td[6].innerHTML = application.emergencySickPersonName;
          } else if (application.leaveCategory === "shortTerm") {
            td[6].innerHTML = application.shortTermReason;
          } else {
            const fileUrl = application.file; // Replace with the actual URL or path to your file

            // Create an anchor element
            const pdfLink = document.createElement('a');
            pdfLink.href = `/static/${fileUrl.split("applications/")[1]}`;
            pdfLink.target = '_blank'; // Open in a new tab
            // pdfLink.download = 'document.pdf'; // Set a default filename for the download (optional)

            // Create an icon or image for the PDF file
            const pdfIcon = document.createElement('i');
            pdfIcon.className = 'fas fa-file-pdf'; // Replace with your PDF icon class or image source

            // Append the icon to the anchor element
            pdfLink.appendChild(pdfIcon);

            // Append the anchor element to the table cell
            td[6].innerHTML = ''; // Clear the container
            td[6].appendChild(pdfLink);
          }




          td[7].innerHTML = application.status;

          // Add a "Delete" button
          const checkButton = document.createElement('button');
          checkButton.className = 'whit approve';
          checkButton.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
          const crossButton = document.createElement('button');
          crossButton.className = 'whit approve';
          crossButton.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
          const cont = document.createElement('div');
          cont.appendChild(checkButton)
          cont.appendChild(crossButton)
          td[8].appendChild(cont);


          checkButton.addEventListener('click', async () => {
            const confirm = window.confirm("Are you sure you want to approve the application?")
            if (confirm) {
              const user = await fetchAdminUsers(); // Fetch the user's data, including their role

              if (user) {
                // Check the user's role
                if (user.role === "Administrator") {
                  if (application.leaveCategory === "travel" || application.leaveCategory === "longTerm") {
                    // Administrator can approve travel and long-term leave
                    approveLeave(application, user);
                  } else {
                    showAlert("Administrators cannot approve this leave type."); // Show an alert for unauthorized leave type
                  }
                } else if (user.role === "Male-SSO") {
                  if (user.gender === "male" && (application.leaveCategory === "shortTerm" || application.leaveCategory === "emergency")) {
                    // Male-SSO can approve male users' short-term and emergency leave
                    approveLeave(application, user);
                  } else {
                    showAlert("Male SSO cannot approve this leave type."); // Show an alert for unauthorized leave type
                  }
                } else if (user.role === "Female-SSO") {
                  if (user.gender === "female" && (application.leaveCategory === "shortTerm" || application.leaveCategory === "emergency")) {
                    // Female-SSO can approve female users' short-term and emergency leave
                    approveLeave(application, user);
                  } else {
                    showAlert("Female SSO cannot approve this leave type."); // Show an alert for unauthorized leave type
                  }
                } else {
                  showAlert("You do not have permission to approve this application."); // Show an alert for unauthorized role
                }
              }
              // window.alert("Sending Mail")
              // const res = await axios.patch(`http://localhost:4001/api/v1/application/${application._id}`, {
              //   status: "approved",
              //   email: user.email
              // })
              // console.log(res)
              // window.alert("Approved Succefully!")

            }
          });


          crossButton.addEventListener('click', async () => {
            const confirm = window.confirm("Are you sure you want to reject the application?")
            if (confirm) {
              const user = await fetchAdminUsers(); // Fetch the user's data, including their role

              if (user) {
                // Check the user's role
                if (user.role === "Administrator") {
                  if (application.leaveCategory === "travel" || application.leaveCategory === "longTerm") {
                    // Administrator can approve travel and long-term leave
                    rejectLeave(application, user);
                  } else {
                    showAlert("Administrators cannot approve this leave type."); // Show an alert for unauthorized leave type
                  }
                } else if (user.role === "Male-SSO") {
                  if (user.gender === "male" && (application.leaveCategory === "shortTerm" || application.leaveCategory === "emergency")) {
                    // Male-SSO can approve male users' short-term and emergency leave
                    rejectLeave(application, user);
                  } else {
                    showAlert("Male SSO cannot approve this leave type."); // Show an alert for unauthorized leave type
                  }
                } else if (user.role === "Female-SSO") {
                  if (user.gender === "female" && (application.leaveCategory === "shortTerm" || application.leaveCategory === "emergency")) {
                    // Female-SSO can approve female users' short-term and emergency leave
                    rejectLeave(application, user);
                  } else {
                    showAlert("Female SSO cannot approve this leave type."); // Show an alert for unauthorized leave type
                  }
                } else {
                  showAlert("You do not have permission to approve this application."); // Show an alert for unauthorized role
                }
              }
              // window.alert("Sending Rejection Mail")
              // const res = await axios.patch(`http://localhost:4001/api/v1/application/${application._id}`, {
              //   status: "rejected",
              //   email: user.email
              // })
              // console.log(res)
              // window.alert("Rejected Successfully!")

            }
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }

  // Create tables for male and female users
  createTable(allapplications);
  // createTable(femaleUsers, 'Female');

  async function fetchAdminUsers() {
    try {
      const response = await axios.get("http://localhost:4001/api/v1/users", {
        params: {
          role_id: 1, // Filter by role_id equal to 1 (admin)
        },
      });

      return response.data.data;
    } catch (error) {
      console.error("Error fetching admin user data: ", error);
      return null;
    }
  }

  async function approveLeave(application, user) {
    try {
      window.alert("Sending Approved Mail");
      const res = await axios.patch(`http://localhost:4001/api/v1/application/${application._id}`, {
        status: "approved",
        email: user.email
      });
      console.log(res);
      window.alert("Approved Successfully!");
    } catch (error) {
      console.error("Error approving leave: ", error);
      showAlert("Failed to approve leave.");
    }
  }


  async function rejectLeave(application, user) {
    try {
      window.alert("Sending Rejected Mail");
      const res = await axios.patch(`http://localhost:4001/api/v1/application/${application._id}`, {
        status: "rejected",
        email: user.email
      });
      console.log(res);
      window.alert("Rejected Successfully!");

    } catch (error) {
      console.error("Error rejecting leave: ", error);
      showAlert("Failed to rejecting leave.");
    }
  }

}

initialize();



