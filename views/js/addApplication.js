import { showAlert } from "./alert.js";

var obj
if (document.cookie) {
    obj = JSON.parse(document.cookie.substring(6))
} else {
    obj = JSON.parse('{}')
}

export const submitApplication = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://localhost:4001/api/v1/application/submitApplication",
            data,
            //  headers: {
            //     'Content-Type': 'multipart/form-data', 
            // }
            
        })
        if (res.data.status === "success") {
            showAlert("success", "Leave Application Succesfully Submitted!!!")
            window.setTimeout(() => {
                location.reload()
            }, 2000)
        }
        console.log(res)
    } catch (err) {
        let message = typeof err.message !== 'undefined'
            ? err.response.data.message
            : err.message
        showAlert('error', "Error:Cannot Submit the Leave Appplication", message)
    }

}

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
    submitApplication(form);
});