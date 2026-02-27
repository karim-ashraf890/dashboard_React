import '../../global.scss';
import '../common/sideMenu.scss';
import './add.scss';
import '../common/sideMenu';
import axios from "axios";
import { refreshTokenFun } from "../../api/api";
import { isEmail, removeError, showError } from '../../helpers/helper';

let token = localStorage.getItem("accessToken");
if (!token) window.location.href = "/login.html";

let refreshToken = localStorage.getItem("refreshToken");

const apiUrl = "http://localhost:9696";

// =================== Errors ===================
let errors: {
    firstName: string[];
    lastName: string[];
    email: string[];
    phone: string[];
    country: string[];
    password: string[];
    confirmPassword: string[];
    profile_image: string[];
} = {
    firstName: [],
    lastName: [],
    email: [],
    phone: [],
    country: [],
    password: [],
    confirmPassword: [],
    profile_image: [],
};

// =================== Inputs ===================
const firstNameInput = document.getElementById("firstName") as HTMLInputElement;
const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const countryCodeSelect = document.getElementById("countryCode") as HTMLSelectElement;
const phoneInput = document.getElementById("phone") as HTMLInputElement;
const passwordInput = document.getElementById("Password") as HTMLInputElement;
const confirmPasswordInput = document.getElementById("ConfirmPassword") as HTMLInputElement;

const avatarPreview = document.getElementById('avatarPreview') as HTMLImageElement;
const avatarInput = document.getElementById('avatarInput') as HTMLInputElement;

const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;

// =================== Events ===================
firstNameInput.addEventListener("keyup", validateFirstName);
lastNameInput.addEventListener("keyup", validateLastName);
emailInput.addEventListener("keyup", validateEmail);
phoneInput.addEventListener("keyup", validatePhone);
countryCodeSelect.addEventListener("change", validatePhone);
passwordInput.addEventListener("keyup", validatePassword);
confirmPasswordInput.addEventListener("keyup", validateConfirmPassword);

avatarPreview.addEventListener('click', () => avatarInput.click());
avatarInput.addEventListener('change', handleAvatarChange);

submitBtn.addEventListener("click", onSubmit);

// =================== Validators ===================
function validateFirstName() {
    errors.firstName = [];
    const v = firstNameInput.value.trim();

    if (v === "") {
        errors.firstName.push("Must enter this field");
    } else if (v.length < 2) {
        errors.firstName.push("Name should be more than 2 length");
    }

    if (errors.firstName.length) showError("firstName", errors.firstName);
    else removeError("firstName");
}

function validateLastName() {
    errors.lastName = [];
    const v = lastNameInput.value.trim();

    if (v === "") {
        errors.lastName.push("Must enter this field");
    } else if (v.length < 2) {
        errors.lastName.push("Name should be more than 2 length");
    }

    if (errors.lastName.length) showError("lastName", errors.lastName);
    else removeError("lastName");
}

function validateEmail() {
    errors.email = [];
    const v = emailInput.value.trim();

    if (v === "") {
        errors.email.push("Must enter this field");
    } else if (!isEmail(v)) {
        errors.email.push("Wrong email");
    }

    if (errors.email.length) showError("email", errors.email);
    else removeError("email");
}

function validatePhone() {
    errors.phone = [];
    errors.country = [];

    const phoneValue = phoneInput.value.trim();
    const code = countryCodeSelect.value; // مثال: "20"

    if (!code) {
        errors.phone.push("Choose country");
        errors.country.push("Choose country");
    }

    if (phoneValue === "") {
        errors.phone.push("Must enter phone number");
    } else {
        // لو عايز تبدأ بـ 0 زي ما كنت عامل
        if (!/^0[0-9]{8,11}$/.test(phoneValue)) {
            errors.phone.push("Mobile number should be like (0)123456789");
        }
    }

    if (errors.phone.length > 0) {
        showError("phone", errors.phone);
        document.querySelector('.phone-box')?.classList.add("phone-error");
    } else {
        removeError("phone");
        document.querySelector('.phone-box')?.classList.remove("phone-error");
    }
}

function validatePassword() {
    errors.password = [];
    const v = passwordInput.value;

    if (v === "") {
        errors.password.push("Must enter this field");
    } else if (v.length < 6) {
        errors.password.push("Password should be more than 5 length");
    }

    if (errors.password.length) showError("Password", errors.password);
    else removeError("Password");
}

function validateConfirmPassword() {
    errors.confirmPassword = [];
    const v = confirmPasswordInput.value;

    if (v === "") {
        errors.confirmPassword.push("Must enter this field");
    } else if (v !== passwordInput.value) {
        errors.confirmPassword.push("Passwords do not match");
    }

    if (errors.confirmPassword.length) showError("ConfirmPassword", errors.confirmPassword);
    else removeError("ConfirmPassword");
}

function validateAvatar() {
    errors.profile_image = [];

    if (avatarInput.files && avatarInput.files.length > 0) {
        const file = avatarInput.files[0];

        const allowed = ["image/png", "image/jpeg", "image/webp"];
        const maxSizeMB = 5;

        if (!allowed.includes(file.type)) {
            errors.profile_image.push("Profile image must be PNG/JPG/WEBP");
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            errors.profile_image.push("Profile image must be <= 5MB");
        }
    }

    const avatarBox = document.querySelector(".avatar-box");
    if (errors.profile_image.length) {
        avatarBox?.classList.add("avatar-error");
        // لو helper عندك يقبل id لعرض error تحت عنصر، تقدر تعمل showError("avatarInput", errors.profile_image)
    } else {
        avatarBox?.classList.remove("avatar-error");
    }
}

function validateAll(): boolean {
    validateFirstName();
    validateLastName();
    validateEmail();
    validatePhone();
    validatePassword();
    validateConfirmPassword();
    validateAvatar();

    const hasErrors =
        errors.firstName.length ||
        errors.lastName.length ||
        errors.email.length ||
        errors.phone.length ||
        errors.password.length ||
        errors.confirmPassword.length ||
        errors.profile_image.length;

    return !hasErrors;
}

// =================== Avatar preview ===================
function handleAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];

        const reader = new FileReader();
        reader.onload = function (e: ProgressEvent<FileReader>) {
            if (e.target && e.target.result) {
                avatarPreview.src = e.target.result as string;
            }
        }
        reader.readAsDataURL(file);

        validateAvatar();
    }
}

// =================== Submit ===================
function onSubmit() {
    if (!validateAll()) return;

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone_number = phoneInput.value.trim();
    const phone_code = countryCodeSelect.value; // "20"
    const password = passwordInput.value;

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone_code", phone_code);
    formData.append("phone_number", phone_number);
    formData.append("password", password);

    if (avatarInput.files && avatarInput.files.length > 0) {
        formData.append("profile_image", avatarInput.files[0]);
    }

    sendRequest(formData);
}

function sendRequest(formData: FormData) {
    axios.post(apiUrl + "/dashboard_students", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token as string,
        }
    })
        .then((response) => {
            console.log("Success:", response.data);
            window.location.href = "/trainees.html";
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                refreshTokenFun(refreshToken as string)
                    .then((tokens) => {
                        token = tokens.token;
                        refreshToken = tokens.refreshToken;

                        return axios.post(apiUrl + "/dashboard_students", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: token as string,
                            }
                        });
                    })
                    .then((response) => {
                        console.log("Success:", response.data);
                        window.location.href = "/trainees.html";
                    })
                    .catch((err) => {
                        localStorage.clear();
                        window.location.href = "/login.html";
                    });
            } else {
                console.log(error?.response?.data?.error?.message || error.message);
                // هنا تقدر تعرض error message من الباك-end ك Toast أو showError عام
            }
        });
}
