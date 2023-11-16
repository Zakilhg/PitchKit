// const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
//
// sideLinks.forEach(item => {
//     const li = item.parentElement;
//     item.addEventListener('click', () => {
//         sideLinks.forEach(i => {
//             i.parentElement.classList.remove('active');
//         })
//         li.classList.add('active');
//     })
// });
//
// const menuBar = document.querySelector('.content nav .bx.bx-menu');
// const sideBar = document.querySelector('.sidebar');
//
// menuBar.addEventListener('click', () => {
//     sideBar.classList.toggle('close');
// });
//
// const searchBtn = document.querySelector('.content nav form .form-input button');
// const searchBtnIcon = document.querySelector('.content nav form .form-input button .bx');
// const searchForm = document.querySelector('.content nav form');
//
// searchBtn.addEventListener('click', function (e) {
//     if (window.innerWidth < 576) {
//         e.preventDefault;
//         searchForm.classList.toggle('show');
//         if (searchForm.classList.contains('show')) {
//             searchBtnIcon.classList.replace('bx-search', 'bx-x');
//         } else {
//             searchBtnIcon.classList.replace('bx-x', 'bx-search');
//         }
//     }
// });
//
// window.addEventListener('resize', () => {
//     if (window.innerWidth < 768) {
//         sideBar.classList.add('close');
//     } else {
//         sideBar.classList.remove('close');
//     }
//     if (window.innerWidth > 576) {
//         searchBtnIcon.classList.replace('bx-x', 'bx-search');
//         searchForm.classList.remove('show');
//     }
// });
//
// const toggler = document.getElementById('theme-toggle');
//
// toggler.addEventListener('change', function () {
//     if (this.checked) {
//         document.body.classList.add('dark');
//     } else {
//         document.body.classList.remove('dark');
//     }
// });



const sideMenu = document.querySelector('aside');
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const items = document.getElementById('list-items');
const formContainer = document.getElementById('form_container');
const darkMode = document.querySelector('.dark-mode');

// Function to open the side menu
function openSideMenu() {
    sideMenu.style.display = 'block';
}

// Function to close the side menu
function closeSideMenu() {
    sideMenu.style.display = 'none';
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelectorAll('span').forEach((span) => span.classList.toggle('active'));
    if (items) {
        items.classList.toggle('night');
    } else if(formContainer) {
        formContainer.classList.toggle('form-container-dark');
    }


    // Store the user's dark mode preference
    const isDarkModeEnabled = document.body.classList.contains('dark-mode-variables');
    localStorage.setItem('darkModeEnabled', isDarkModeEnabled);
}

// Add event listeners using the named functions
menuBtn.addEventListener('click', openSideMenu);
closeBtn.addEventListener('click', closeSideMenu);
darkMode.addEventListener('click', toggleDarkMode);

// Load and apply the user's dark mode preference on page load
const storedDarkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';

if (storedDarkModeEnabled) {
    document.body.classList.toggle('dark-mode-variables');
    darkMode.querySelectorAll('span').forEach((span) => span.classList.toggle('active'));
    if (items) {
        items.classList.toggle('night');
    } else if (formContainer) {
        formContainer.classList.toggle('form-container-dark');
    }
}





