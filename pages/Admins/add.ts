import '../../global.scss';
import '../common/sideMenu.scss';
import './add.scss'
import '../common/sideMenu';
import axios from "axios";
import { refreshTokenFun } from "../../api/api";
import { isEmail, removeError, showError } from '../../helpers/helper';


let token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "/login.html";
};

let refreshToken = localStorage.getItem("refreshToken");

const apiUrl = "http://localhost:9696";


let errors: {
    firstName: string[];
    lastName: string[];
    email: string[];
    phone: string[];
    country: string[];
    password: string[];
    confirmPassword: string[];
} = {
    firstName: [],
    lastName: [],
    email: [],
    phone: [],
    country: [],
    password: [],
    confirmPassword: [],
};

let firstName = document.getElementById("firstName") as HTMLInputElement;
let lastName = document.getElementById("lastName") as HTMLInputElement;
let email = document.getElementById("email") as HTMLInputElement;
let countryCode = document.getElementById("countryCode") as HTMLSelectElement;
let phone = document.getElementById("phone") as HTMLInputElement;
let password = document.getElementById("Password") as HTMLInputElement;
let confirmPassword = document.getElementById("ConfirmPassword") as HTMLInputElement;

firstName.addEventListener("keyup", validateFirstName);
lastName.addEventListener("keyup", validateLastName);
email.addEventListener("keyup", validateEmail);
phone.addEventListener("keyup", validatePhone);
password.addEventListener("keyup", validatePassword);
confirmPassword.addEventListener("keyup", validateConfirmPassword);

function validateFirstName() {
    errors.firstName = [];
    let v = firstName.value.trim();

    if (v === "") {
        errors.firstName.push("Must enter this field");
        errors.firstName.push("Name should be more than 3 length");

    } else if (v.length < 2) {
        errors.firstName.push("Name should be more than 3 length");
    }

    if (errors.firstName.length > 0) {
        showError("firstName", errors.firstName);
    } else {
        removeError("firstName");
    }
}

function validateLastName() {
    errors.lastName = [];
    let v = lastName.value.trim();

    if (v === "") {
        errors.lastName.push("Must enter this field");
        errors.lastName.push("Name should be more than 3 length");

    } else if (v.length < 2) {
        errors.lastName.push("Name should be more than 3 length");
    }

    if (errors.lastName.length > 0) {
        showError("lastName", errors.lastName);
    } else {
        removeError("lastName");
    }
}

function validateEmail() {
    errors.email = [];
    let v = email.value.trim();

    if (v === "") {
        errors.email.push("Must enter this field");
    }
    else if (!isEmail(v)) {
        errors.email.push("Wrong email");
    }

    if (errors.email.length > 0) {
        showError("email", errors.email);
    } else {
        removeError("email");
    }
}

function validatePhone() {
    errors.phone = [];
    let phoneValue = phone.value.trim();
    let code = countryCode.value; // مثال: "+20"

    if (code === "") {
        errors.phone.push("Choose country");
    }

    if (phoneValue === "") {
        errors.phone.push("Mobile number should be like (0)123456789");
        errors.phone.push("Must enter phone number ");

    } else {
        if (!/^0[0-9]{8,11}$/.test(phoneValue)) {
            errors.phone.push("Must enter phone number");
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
    let v = password.value;
    if (v === "") {
        errors.password.push("Password should be more than 5 length");
        errors.password.push("Must enter this field");
    }
    else if (v.length < 6) {
        errors.password.push("Password should be more than 5 length");
    }
    if (errors.password.length > 0) {
        showError("Password", errors.password);
    } else {
        removeError("Password");
    }
}

function validateConfirmPassword() {
    errors.confirmPassword = [];
    let v = confirmPassword.value;

    if (v === "") {
        errors.confirmPassword.push("Must enter this field");
    }
    else if (v !== password.value) {
        errors.confirmPassword.push("Passwords do not match");
    }

    if (errors.confirmPassword.length > 0) {
        showError("ConfirmPassword", errors.confirmPassword);
    } else {
        removeError("ConfirmPassword");
    }
}
const selectAll = document.getElementById("selectAllPermissions") as HTMLInputElement;

selectAll.addEventListener("change", function () {
    const permissionCheckboxes = document.querySelectorAll<HTMLInputElement>(".perm-input");
    for (let i = 0; i < permissionCheckboxes.length; i++) {
        permissionCheckboxes[i].checked = selectAll.checked;
    }
});

function updateSelectAllState() {
    const permissionCheckboxes = document.querySelectorAll<HTMLInputElement>(".perm-input");
    const allChecked = Array.from(permissionCheckboxes).every(cb => cb.checked);
    selectAll.checked = allChecked;
}
interface Permission {
    id: number;
    name_en: string;
    name_ar: string;
    created_at: string;
}

axios.get(apiUrl + "/permissions")
    .then(response => {

        const permissions = response.data.permissions as Permission[];
        const container = document.getElementById("permissionsContainer") as HTMLElement;

        container.innerHTML = "";

        for (let i = 0; i < permissions.length; i++) {

            const perm = permissions[i];

            const col = document.createElement("div");
            col.className = "col-md-3 col-sm-6 mb-2 perm-col";

            const formCheck = document.createElement("div");
            formCheck.className = "form-check perm-check";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = "form-check-input perm-input";
            input.value = perm.id.toString();
            input.id = "perm_" + perm.id;
            input.addEventListener("change", updateSelectAllState);

            const label = document.createElement("label");
            label.className = "form-check-label perm-label";
            label.htmlFor = input.id;
            label.textContent = perm.name_en;

            formCheck.appendChild(input);
            formCheck.appendChild(label);
            col.appendChild(formCheck);
            container.appendChild(col);
        }

    })
    .catch(function (error) {
        console.log(error);
    })

const avatarPreview = document.getElementById('avatarPreview') as HTMLImageElement;
const avatarInput = document.getElementById('avatarInput') as HTMLInputElement;

const submitbtn = document.getElementById('submit-btn') as HTMLButtonElement;

avatarPreview.addEventListener('click', () => {
    avatarInput.click();
});

avatarInput.addEventListener('change', (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // عرض الصورة في avatarPreview
        const reader = new FileReader();
        reader.onload = function (e: ProgressEvent<FileReader>) {
            if (e.target && e.target.result) {
                avatarPreview.src = e.target.result as string;
            }
        }
        reader.readAsDataURL(file);
        // رفع الصورة للسيرفر
        // uploadFileToServer(file);
    }
});

submitbtn.addEventListener("click", () => {
    console.log("Submit clicked!");

    const firstName = (document.getElementById("firstName") as HTMLInputElement).value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const phoneCode = (document.getElementById("countryCode") as HTMLSelectElement).value;
    const password = (document.getElementById("Password") as HTMLInputElement).value;
    const permissionCheckboxes = document.querySelectorAll<HTMLInputElement>(".perm-input:checked");
    const selectedPermissions: number[] = Array.from(permissionCheckboxes).map(cb => Number(cb.value));

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone_code", phoneCode.replace("+", ""));
    formData.append("phone_number", phone);
    formData.append("password", password);

    for (let i = 0; i < selectedPermissions.length; i++) {
        formData.append("permissions[]", selectedPermissions[i].toString());
    }
    if (avatarInput.files && avatarInput.files.length > 0) {
        formData.append("profile_image", avatarInput.files[0]);
    }
    sendRequest(apiUrl, formData);
});

function sendRequest(apiUrl: string, formData: FormData) {
    axios.post(apiUrl + "/admins", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token
        }
    })
        .then((response) => {
            console.log("Success:", response.data);
            // alert("Admin added successfully!");
            window.location.href = "/admins.html";

        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                refreshTokenFun(refreshToken)
                    .then((tokens) => {
                        token = tokens.token;
                        refreshToken = tokens.refreshToken;
                        axios.post(apiUrl + "/admins", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                                Authorization: token
                            }
                        })
                            .then((response) => {
                                console.log("Success:", response.data);
                                // alert("Admin added successfully!");
                                window.location.href = "/admins.html";

                            })
                            .catch((error) => {
                                console.log(error.response.data.error.message)
                                // هناا ايرور من الباك اند 
                            })
                    })
                    .catch((error) => {
                        localStorage.clear();
                        window.location.href = "/login.html";
                    });
            } else {
                console.log(error.response.data.error.message)
            }
        });
}





























// function uploadFileToServer(file: File) {
//     const formData = new FormData();
//     formData.append("profile_image", file);

//     const apiUrl = "http://localhost:9696";


// axios
//     .post(apiUrl + "/admins", formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: token
//         },
//     })
//     .then(function (response) {
//         console.log("Uploaded:", response.data);
//     })
//     .catch(async function (error) {
//         console.log("Upload error:", error);

//         // مثال لو حابب تستخدم refreshTokenFun لو التوكن منتهية
//         if (error.response && error.response.status === 401) {
//             refreshTokenFun(refreshToken)
//                 .then((tokens) => {
//                     token = tokens.token;
//                     refreshToken = tokens.refreshToken;
//                     return axios.post(apiUrl + "/admins", formData, {
//                         headers: {
//                             "Content-Type": "multipart/form-data",
//                             Authorization: token
//                         }
//                     });
//                 })
//                 .then((response) => {
//                     // renderAdmins(response.data.admins);
//                 })
//                 .catch((error) => {
//                     localStorage.clear();
//                     // window.location.href = "/login.html";
//                 });

//         }

//     });
// }

