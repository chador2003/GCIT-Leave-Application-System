import { showAlert } from "./alert.js";

// Fetch user data from your API
const fetchUser = async () => {
  try {
    const response = await axios.get("http://localhost:4001/api/v1/users");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return [];
  }
};

const initialize = async () => {
  const allusers = await fetchUser();

  // Separate arrays for male and female users
  const maleUsers = allusers.filter(user => user.role_id === 0 && user.gender === 'male');
  const femaleUsers = allusers.filter(user => user.role_id === 0 && user.gender === 'female');

  // Function to create a table for a given set of users
  function createTable(users, gender) {
    const tableBody = document.getElementById(`myTableBody${gender}`);
    const userTable = document.getElementById(`myTable${gender}`);

    users.forEach(user => {
      const row = tableBody.insertRow();
      const td = [];
      for (var i = 0; i < 4; i++) {
        td[i] = row.insertCell(i);
      }

      // Populate the table rows with user data
      td[0].innerHTML = user._id;
      td[1].innerHTML = user.name;
      td[2].innerHTML = user.email;


      // Add a "Delete" button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'whit delete';
      deleteButton.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
      td[3].appendChild(deleteButton);

      // CSS for delete button
      deleteButton.style.backgroundColor = 'red';
      deleteButton.style.borderRadius = '5px';
      deleteButton.style.padding = '5px'; // Adjust the padding to make it smaller
      deleteButton.style.color = 'white';

      // Attach click event listeners for delete buttons
      deleteButton.addEventListener('click', () => deleteUser(user._id));
    });
  }

  // Create tables for male and female users
  createTable(maleUsers, 'Male');
  createTable(femaleUsers, 'Female');
}

initialize();



// export const deleteUser = async (id) => {
//   const userConfirmation = confirm("Are you sure you want to delete this user?");
//   if (userConfirmation) {
//     try {
//       const res = await axios({
//         method: 'DELETE',
//         url: `http://localhost:4001/api/v1/users/${id}`,
//       });
//       if (res.data.status === "success") {
//         showAlert("success", "User Deleted Successfully!");
//         window.setTimeout(() => {
//           location.reload(true);
//         }, 1000);
//       }
//     } catch (err) {
//       let message =
//         typeof err.response !== "undefined"
//           ? err.response.data.message
//           : err.message;
//       showAlert("error", message);
//     }
//   } else {
//     // User clicked 'Cancel' on the confirmation dialog
//     showAlert("info", "Deletion canceled!.");
//   }
// };


export const deleteUser = async (id) => {
  const userConfirmation = confirm("Are you sure you want to delete this user?");

  if (userConfirmation) {
    try {
      // Fetch the user making the request
      const currentUserResponse = await axios.get("http://localhost:4001/api/v1/users");
      const currentUser = currentUserResponse.data.data;

      // Fetch the user to be deleted
      const userResponse = await axios.get(`http://localhost:4001/api/v1/users/${id}`);
      const userToDelete = userResponse.data.data;

      // Check if the current user has the privilege to delete the target user
      if (
        (currentUser.role_id === 1 && currentUser.role === "Administrator") ||
        (currentUser.role_id === 1 && currentUser.role === "Male_SSO" && userToDelete.gender === "male") ||
        (currentUser.role_id === 1 && currentUser.role === "Female_SSO" && userToDelete.gender === "female")
      ) {
        const res = await axios({
          method: 'DELETE',
          url: `http://localhost:4001/api/v1/users/${id}`,
        });

        if (res.data.status === "success") {
          showAlert("success", "User Deleted Successfully!");
          window.setTimeout(() => {
            location.reload(true);
          }, 1000);
        }
      } else {
        showAlert("error", "You don't have permission to delete this user!.");
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
    showAlert("info", "Deletion canceled!.");
  }
};
