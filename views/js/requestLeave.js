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
  // console.log(allapplications)


  // Function to create a table for a given set of users
  async function createTable(applications) {
    for (const application of applications.applications) {
      try {
        if (application.status === "pending" && application.user !== null) {
          const res = await axios.get(`http://localhost:4001/api/v1/users/${application.user._id}`);
          let user = res.data.data;
          // console.log(user)
          let gender;
          user.gender === "male" ? gender = "Male" : gender = "Female";

          const tableBody = document.getElementById(`myTableBody${gender}`);

          var obj = JSON.parse(document.cookie.substring(6))
          // console.log(obj.role)
          const row = tableBody.insertRow();
          const td = [];
          for (var i = 0; i < 9; i++) {
            td[i] = row.insertCell(i);
          }

          // Populate the table rows with user data
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
          checkButton.className = 'green approve';
          checkButton.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
          checkButton.style.backgroundColor = 'green'; // Set the background color
          checkButton.style.border = 'none';
          checkButton.style.borderRadius = '5px';
          checkButton.style.padding = '2px';
          checkButton.style.color = 'white';
          checkButton.style.cursor = 'pointer';
          checkButton.style.marginRight = '5px';
          checkButton.style.height = '20px';

          checkButton.addEventListener('mouseover', function () {
            checkButton.style.backgroundColor = 'darkgreen';
          });

          checkButton.addEventListener('mouseout', function () {
            checkButton.style.backgroundColor = 'green';
          });

          const crossButton = document.createElement('button');
          crossButton.className = 'red approve';
          crossButton.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
          crossButton.style.backgroundColor = 'red'; // Set the background color
          crossButton.style.border = 'none';
          crossButton.style.borderRadius = '5px';
          crossButton.style.padding = '2px'; // Adjust the padding as needed (top, right, bottom, left)
          crossButton.style.color = 'white';
          crossButton.style.cursor = 'pointer';
          crossButton.style.marginRight = '5px'; // Adjust the margin as needed
          crossButton.style.height = '20px';

          // Add hover effect to the crossButton
          crossButton.addEventListener('mouseover', function () {
            crossButton.style.backgroundColor = 'darkred';
          });

          crossButton.addEventListener('mouseout', function () {
            crossButton.style.backgroundColor = 'red';
          });

          const cont = document.createElement('div');
          cont.appendChild(checkButton)
          cont.appendChild(crossButton)
          td[8].appendChild(cont);


          checkButton.addEventListener('click', async (e) => {
            var sex = (e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText)

            if (obj.role === "Administrator" && (application.leaveCategory !== "travel" && application.leaveCategory !== "longTerm")) {
              alert("Admininstrator can only approve or reject travel and long term leave!");
              return;
            }

            if (obj.role === "Male-SSO") {
              if (sex !== "Male" || (application.leaveCategory !== "shortTerm" && application.leaveCategory !== "emergency")) {
                alert("Male SSO can only approve or reject male short term and emergency leave!");
                return;
              }
            }
            if (obj.role === "Female-SSO") {
              if (sex !== "Female" || (application.leaveCategory !== "shortTerm" && application.leaveCategory !== "emergency")) {
                alert("Female SSO can only approve or reject female short term and emergency leave!");
                return;
              }
            }

            const confirm = window.confirm("Are you sure you want to approve the application?")
            if (confirm) {
              window.alert("Sending Mail")
              const res = await axios.patch(`http://localhost:4001/api/v1/application/${application._id}`, {
                status: "approved",
                email: user.email
              })
              console.log(res)
              window.alert("Approved Succefully!")
            }
          });

          crossButton.addEventListener('click', async (e) => {
            var sex = (e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText)

            if (obj.role === "Administrator" && (application.leaveCategory !== "travel" && application.leaveCategory !== "longTerm")) {
              alert("Admininstrator can only approve or reject travel and long term leave!");
              return;
            }

            if (obj.role === "Male-SSO") {
              if (sex !== "Male" || (application.leaveCategory !== "shortTerm" && application.leaveCategory !== "emergency")) {
                alert("Male SSO can only approve or reject male short term and emergency leave!");
                return;
              }
            }
            if (obj.role === "Female-SSO") {
              if (sex !== "Female" || (application.leaveCategory !== "shortTerm" && application.leaveCategory !== "emergency")) {
                alert("Female SSO can only approve or reject Female short term and emergency leave!");
                return;
              }
            }

            const confirm = window.confirm("Are you sure you want to reject the application?")
            if (confirm) {
              window.alert("Sending Rejection Mail")
              const res = await axios.patch(`http://localhost:4001/api/v1/application/${application._id}`, {
                status: "rejected",
                email: user.email
              })
              console.log(res)
              window.alert("Rejected Successfully!")

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
}

initialize();


