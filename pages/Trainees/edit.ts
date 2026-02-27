import '../../global.scss';
import '../common/sideMenu.scss';
import './add.scss';
import '../common/sideMenu';
import axios from "axios";
import { refreshTokenFun } from "../../api/api";

let token = localStorage.getItem("accessToken");
if (!token) window.location.href = "/login.html";
let refreshToken = localStorage.getItem("refreshToken");

const apiUrl = "http://127.0.0.1:9696";
const endpoint = "/dashboard_students";

const urlParams = new URLSearchParams(window.location.search);
const traineeId = urlParams.get("id") ? parseInt(urlParams.get("id") as string) : null;

if (!traineeId) {
    alert("No trainee id provided!");
    window.location.href = "/trainees.html?page=1";
}

let selectedAvatarFile: File | null = null;

const avatarInput = document.getElementById("avatarInput") as HTMLInputElement;
const avatarPreview = document.getElementById("avatarPreview") as HTMLImageElement;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement;

avatarPreview?.addEventListener("click", () => avatarInput?.click());

avatarInput?.addEventListener("change", (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        const file = input.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && e.target.result) avatarPreview.src = e.target.result as string;
        };
        reader.readAsDataURL(file);

        selectedAvatarFile = file;
    }
});

function fillForm(data: any) {
    (document.getElementById("firstName") as HTMLInputElement).value = data.first_name || "";
    (document.getElementById("lastName") as HTMLInputElement).value = data.last_name || "";
    (document.getElementById("email") as HTMLInputElement).value = data.user?.email || "";

    const countrySelect = document.getElementById("countryCode") as HTMLSelectElement;
    countrySelect.value = data.user?.phone_code || "";

    (document.getElementById("phone") as HTMLInputElement).value = data.user?.phone_number || "";

    avatarPreview.src = data.profile_image_url && data.profile_image_url !== ""
        ? data.profile_image_url
        : "../../assets/imge/avatar_holder_dashboard.gif";
}

function getTrainee(id: number) {
    axios.get(`${apiUrl}${endpoint}/${id}`, { headers: { Authorization: token } })
        .then(res => fillForm(res.data))
        .catch(err => {
            if (err.response && err.response.status === 401) {
                refreshTokenFun(refreshToken)
                    .then(tokens => {
                        token = tokens.token;
                        refreshToken = tokens.refreshToken;
                        return axios.get(`${apiUrl}${endpoint}/${id}`, { headers: { Authorization: token } });
                    })
                    .then(res => fillForm(res.data))
                    .catch(() => {
                        localStorage.clear();
                        window.location.href = "/login.html";
                    });
            } else {
                console.log(err.response?.data);
                alert("Failed to fetch trainee data.");
            }
        });
}

if (traineeId) getTrainee(traineeId);

submitBtn?.addEventListener("click", () => {
    const firstName = (document.getElementById("firstName") as HTMLInputElement).value.trim();
    const lastName = (document.getElementById("lastName") as HTMLInputElement).value.trim();
    const email = (document.getElementById("email") as HTMLInputElement).value.trim();
    const phone = (document.getElementById("phone") as HTMLInputElement).value.trim();
    const phoneCode = (document.getElementById("countryCode") as HTMLSelectElement).value;

    if (!traineeId) return;

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone_code", phoneCode);
    formData.append("phone_number", phone);

    if (selectedAvatarFile) {
        formData.append("profile_image", selectedAvatarFile);
    }

    axios.post(`${apiUrl}${endpoint}/${traineeId}`, formData, { headers: { Authorization: token } })
        .then(() => {
            alert("Trainee updated successfully!");
            window.location.href = "/trainees.html?page=1";
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                refreshTokenFun(refreshToken)
                    .then(tokens => {
                        token = tokens.token;
                        refreshToken = tokens.refreshToken;
                        return axios.post(`${apiUrl}${endpoint}/${traineeId}`, formData, { headers: { Authorization: token } });
                    })
                    .then(() => {
                        alert("Trainee updated successfully!");
                        window.location.href = "/trainees.html?page=1";
                    })
                    .catch(() => {
                        localStorage.clear();
                        window.location.href = "/login.html";
                    });
            } else {
                console.log(err.response?.data);
                alert("Failed to update trainee.");
            }
        });
});
