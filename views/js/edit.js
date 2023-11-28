import { showAlert } from './alert.js'

var receivedVariable = localStorage.getItem("variable");

// Use the received value as needed
console.log(receivedVariable);

// Clear the stored value if necessary
localStorage.removeItem("variable");





const property = async (receivedVariable) => {
    try {
        const res = await axios({
            method: "GET",
            url: 'http://localhost:4001/api/v1/property/' + receivedVariable,
        })
        console.log("display")
        displayproperty(res.data)
    } catch (err) {
        console.log(err)
    }
}
property(receivedVariable)

const displayproperty = (property) => {
    var element = property.data.property1
    console.log(element)

    document.getElementById("Dzongkhag").value = element.Dzongkhag;
    document.getElementById('Gewog').value = element.Gewog;
    document.getElementById('Price').value = element.Price;
    document.getElementById('CONTACT').value = element.contactNumber;
    document.getElementById('Description').value = element.Description;
    document.getElementById("Name").value = element.Name;
    //rvvvg  console.log(element
}


// "Dzongkhag":Dzongkhag,
// "Gewog":Gewog,
// "Description": Description,
// "Price": Price,
// "Type": Type, 
// "imageCover": imageCover,
// "Name":Name,
// "contactNumber": contactNumber


export const updateproperty = async (receivedVariable, Dzongkhag, Description, Gewog, Price, Type, imageCover, Name, contactNumber) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4001/api/v1/property/' + receivedVariable,
            data: {
                "Dzongkhag": Dzongkhag,
                "Gewog": Gewog,
                "Description": Description,
                "Price": Price,
                "Type": Type,

                "Name": Name,
                "contactNumber": contactNumber



            }
        })
        if (res.data.status === 'success') {
            alert('Data updated successfully!')

        }
    } catch (err) {
        showAlert('error', 'sorry try again later')
    }
}



const editproperty = async (x) => {
    try {
        const res = await axios({
            method: "DELETE",
            url: 'http://localhost:4001/api/v1/property/' + x,
        })
        console.log("Deleted")
        // Show a pop-up message
        alert("Property deleted successfully!");

        // Redirect to another page
        window.location.href = "viewall.html";
    } catch (err) {
        console.log(err)
    }
}




const propert = async (receivedVariable) => {
    try {
        const res = await axios({
            method: "GET",
            url: 'http://localhost:4001/api/v1/property/' + receivedVariable,
        })

        const id = await displaypropert(res.data);

        return id;
    } catch (err) {
        console.log(err)

    }
}


const displaypropert = (property) => {
    var element = property.data.property1


    var el1 = element.user._id

    return el1;

    //rvvvg  console.log(element)


}



var e11 = document.querySelector('.cancelbtn');
// e11.addEventListener("click", function() {
//   console.log(receivedVariable);
//   editproperty(receivedVariable);
// });



e11.addEventListener("click", async function () {
    console.log(receivedVariable);
    const obj = JSON.parse(document.cookie.substring(6))

    const ss = await propert(receivedVariable);

    if (ss == obj._id) {
        editproperty(receivedVariable);
    }
    else {
        alert("You dont have right to Edit& Delete!")
        // window.location.href = "viewall.html";
    }

});




var e122 = document.querySelector('.signupbtn');
e122.addEventListener("click", async function () {
    const Dzongkhag = document.getElementById("Dzongkhag").value;
    const Description = document.getElementById("Description").value;
    const Gewog = document.getElementById("Gewog").value;
    const Price = document.getElementById("Price").value;
    const Type = document.getElementById("Type").value;
    const imageCover = document.getElementById("myFile").value;
    const Name = document.getElementById("Name").value;
    const contactNumber = document.getElementById("CONTACT").value;
    const obj = JSON.parse(document.cookie.substring(6))
    const ss = await propert(receivedVariable);
    if (ss == obj._id) {
        updateproperty(receivedVariable, Dzongkhag, Description, Gewog, Price, Type, imageCover, Name, contactNumber);
    }
    else {
        alert("You dont have right to Edit& Delete!")
        // window.location.href = "viewall.html";
    }

});