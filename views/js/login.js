import {showAlert} from './alert.js'

document.querySelector('.form').addEventListener('submit', (e)=>{
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})

const login = async (email, password)=>{
    try{
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/api/v1/users/login',
            data: {
                email,
                password,
            },
        })
        if (res.data.status === 'success'){
            showAlert('success', 'Logged in succesfully')
            window.setTimeout(()=>{
                location.assign('/applications')
            }, 1500)
            var obj = res.data.data.user
            console.log(obj)
            document.cookie = 'token = '+ JSON.stringify(obj)
            console.log(obj)
        }

    }catch(err){
        let message =
            typeof err.response !== 'undefined'
                ? err.response.data.message
                : err.message
        showAlert('error', 'Error: Incorrect email or password', message)

    }
}