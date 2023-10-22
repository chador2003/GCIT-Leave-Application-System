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

      // css for delete button
      deleteButton.style.backgroundColor = 'red';
      deleteButton.style.borderRadius = '5%';
      deleteButton.style.padding = '8px';
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

export const deleteUser = async (id) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://localhost:4001/api/v1/users/${id}`,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User Deleted!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.message
        : err.message;
    showAlert('error', message);
  }
};
