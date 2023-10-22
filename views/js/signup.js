import { showAlert } from "./alert.js";

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('confirm-password').value
    const gender = document.querySelector('input[name=gender]:checked').value
    signup(name, email, password, passwordConfirm, gender)
})

export const signup = async (name, email, password, passwordConfirm, gender) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
                gender
            },
        })

        if (res.data.status === 'success') {
            showAlert('success', 'Account created successfuly!')
            window.setTimeout(() => {
                location.assign('/login')
            }, 1500)
        }
    } catch (err) {
        let message = typeof err.response !== 'undefined'
            ? err.response.data.message
            : err.message
        showAlert('error', 'Error: Passwords are not the same or your email is already used.', message)
    }
}






