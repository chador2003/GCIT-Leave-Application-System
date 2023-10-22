const getusers = await axios({
  method: "GET",
  url: "http://localhost:4001/api/v1/users"
})
const allusers = getusers.data.data;
const users = [];
let maleCount = 0;
let femaleCount = 0;

allusers.forEach(user => {
  if (user.role_id === 0) {
    users.push(user);
    if (user.gender === "male") {
      maleCount++;
    } else if (user.gender === "female") {
      femaleCount++;
    }
  }
});


document.getElementById("users").innerHTML = users.length;
document.getElementById("maleUsers").innerHTML = maleCount;
document.getElementById("femaleUsers").innerHTML = femaleCount;
