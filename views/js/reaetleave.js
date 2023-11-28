import { showAlert } from "./alert.js";

const style = document.createElement('style');
style.innerHTML = `
  .whit {
    display: inline-block;
    margin-right: 5px;
    font-size: 14px; /* Adjust the font size as needed */
  }

  .approve ion-icon {
    font-size: 16px; /* Adjust the font size as needed */
  }

  .cont {
    display: flex;
    align-items: center; /* Align buttons vertically in the center */
  }
`;

document.head.appendChild(style);

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

  async function createTable(applications) {
    for (const application of applications.applications) {
      try {
        if (application.status === "pending") {
          const res = await axios.get(`http://localhost:4001/api/v1/users/${application.user._id}`);
          let user = res.data.data;

          // Check if user is not null before accessing properties
          if (user && user._id) {
            // Rest of your code for creating the table
          } else {
            console.error('Error: User data is null or missing _id property');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  }

  createTable(allapplications);
}

initialize();
