import {showAlert} from "./alert.js";

export const updatePassword = async (data)=>{
    try{
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:4001/api/v1/users/updateMyPassword',
            data,
        })
        console.log(res.data.status)
        if (res.data.status==='success'){
            showAlert('success', "Data updated successfully!")
            window.setTimeout(()=>{
                location.reload()
            }, 1000)
        }
    }catch(err){
        let message =
        typeof err.response !== 'undefined'
            ? err.response.data.message
            : err.message
            showAlert('error', err.response.data.message)
    }
}
const userPasswordForm = document.querySelector('.form')
userPasswordForm.addEventListener('submit', async(e)=>{
    e.preventDefault()

    document.querySelector('.btn--save--password').textContent='Updating...'
    const passwordCurrent = document.getElementById('current_password').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('confirm-password').value
    await updatePassword(
        {passwordCurrent, password, passwordConfirm},
        'password',
    )
    document.querySelector('.btn--save--password').textContent = 'Save password'
    document.getElementById('current_password').value=''
    document.getElementById('password').value=''
    document.getElementById('confirm-password').value =''
})