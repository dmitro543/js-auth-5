// import '../../script/test'

// console.log('container')

document.addEventListener('DOMContentLoaded', () => {
    if(window.session) {
        const { user } = window.session

        if (user.isConfirm) {
            location.assign('/home')
        } else {
            location.assign('/sign-up-comfirm')
        }
    } else {
        location.assign('/sign-up')
    }
})
