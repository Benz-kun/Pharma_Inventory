const wrapper = document.querySelector('.wrapper')
const registerLink = document.querySelector('.register-link')
const loginLink = document.querySelector('.login-link')
const pharmalogin = document.querySelector('#pharma-login')
const adminlogin = document.querySelector('#admin-login')

registerLink.onclick = () => {
    wrapper.classList.add('active')
}

loginLink.onclick = () => {
    wrapper.classList.remove('active')
}
pharmalogin.onclick=()=> {
    window.location.href = 'D:\\My_Space\\CODE\\Pharma_inventory\\front_end\\index2.html';
}
adminlogin.onclick =()=> {
    window.location.href = 'D:\\My_Space\\CODE\\Pharma_inventory\\front_end\\admin_page.html';
}