import { showAlert } from './alert.js'

document.querySelector('.form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:4001/api/v1/users/login',
      data: {
        email,
        password,
      }
    });

    if (res.data.status === 'success') {
      const user = res.data.data.user;

      // Check the role_id of the logged-in user
      if (user.role_id === 1) {
        showAlert('success', 'Logged in successfully');
        window.setTimeout(() => {
          location.assign('/admusers');
        }, 1500);
        var obj = user;
        console.log(obj);
        document.cookie = 'token=' + JSON.stringify(obj);
        console.log(obj);
      } else {
        showAlert('error', 'Access Denied', 'You are not an Admin');
      }
    }
  } catch (err) {
    let message =
      typeof err.response !== 'undefined'
        ? err.response.data.message
        : err.message;
    showAlert('error', 'Error: Incorrect email or password', message);
  }
};
