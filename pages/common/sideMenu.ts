import '../../global.scss';
import axios from "axios";



let token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "/login.html";
}

let refreshToken = localStorage.getItem("refreshToken");

let user = localStorage.getItem("user");


const userObj = JSON.parse(user);
const fullName = userObj.admin.first_name + " " + userObj.admin.last_name;
const profileName = document.querySelector(".profile-name") as HTMLElement;
const menuTitles = document.querySelectorAll(".side-menu-title") as NodeListOf<HTMLElement>;


profileName.textContent = fullName;

const CloseIcon = document.getElementById("closing") as HTMLElement;
const OpenIcon = document.getElementById("open") as HTMLElement;
const navBar = document.getElementById("navBar") as HTMLElement;
const home = document.getElementById("home") as HTMLElement;
const sideMenuImg = document.querySelector(".side-menu-profile") as HTMLImageElement;
const sideMenuIcon = document.querySelector(".side-menu-icon") as HTMLImageElement;

function removeCols(element: HTMLElement) {
    element.classList.forEach((cls: string) => {
        if (cls.startsWith("col-")) {
            element.classList.remove(cls);
        }
    });
}

function navbarContro() {
    CloseIcon.style.display = "inline-block";
    OpenIcon.style.display = "none";

    CloseIcon.addEventListener("click", () => {
        removeCols(navBar);
        removeCols(home);
        navBar.classList.add("col-1", "align-items-center", "ms-0");
        home.classList.add("col-11");
        profileName.style.display = "none";
        sideMenuImg.classList.add("side-menu-profile-big");
        sideMenuIcon.classList.add("side-menu-icon-big");
        document.body.classList.add("nav-collapsed");



        CloseIcon.style.display = "none";
        OpenIcon.style.display = "inline-block";
        menuTitles.forEach(title => {
            title.style.display = "none";
        });
    });

    OpenIcon.addEventListener("click", () => {
        removeCols(navBar);
        removeCols(home);
        navBar.classList.remove("col-1", "align-items-center", "ms-0");
        navBar.classList.add("col-2");
        home.classList.add("col-10");

        CloseIcon.style.display = "inline-block";
        OpenIcon.style.display = "none";
        profileName.style.display = "inline-block";
        sideMenuImg.classList.remove("side-menu-profile-big");
        sideMenuIcon.classList.remove("side-menu-icon-big");
        document.body.classList.remove("nav-collapsed");


        menuTitles.forEach(title => {
            title.style.display = "inline-block";
        });


    });
}

window.addEventListener("DOMContentLoaded", navbarContro);

const logOutBtn = document.getElementById("logoutBtn");
logOutBtn.addEventListener("click", (event) => {
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken");
    window.location.href = "/login.html";

})
const currentPage = window.location.pathname;
const links = document.querySelectorAll(".side-menu-link");

let activeAdded = false;

links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
        activeAdded = true;
    }
});

// لو مفيش صفحة مطابقة — خلّي أول واحدة Active افتراضيًا
if (!activeAdded && links.length > 0) {
    links[1].classList.add("active"); // أول واحدة بعد الـ Profile
}