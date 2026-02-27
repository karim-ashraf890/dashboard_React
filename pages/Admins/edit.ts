import '../../global.scss';
import '../common/sideMenu.scss';
import './add.scss';
import '../common/sideMenu';
import axios from "axios";
import { refreshTokenFun } from "../../api/api";

let token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "/login.html";
}

let refreshToken = localStorage.getItem("refreshToken");

const apiUrl = "http://127.0.0.1:9696";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const adminId = urlParams.get('id') ? parseInt(urlParams.get('id')!) : null;

if (!adminId) {
    alert("No admin id provided!");
    window.location.href = "/admins.html";
}

let selectedAvatarFile: File | null = null;

const avatarInput = document.getElementById("avatarInput") as HTMLInputElement;
const avatarPreview = document.getElementById("avatarPreview") as HTMLImageElement;

// 🔹 Select All checkbox
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

avatarPreview.addEventListener("click", () => {
    avatarInput.click();
});

avatarInput.addEventListener('change', (event: Event) => {
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

        selectedAvatarFile = file;
    }
});

function getAdmin(id: number) {
    axios.get(`${apiUrl}/admins/${id}`, {
        headers: { Authorization: token }
    })
        .then(response => {
            fillForm(response.data);
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                refreshTokenFun(refreshToken)
                    .then(tokens => {
                        token = tokens.token;
                        refreshToken = tokens.refreshToken;
                        return axios.get(`${apiUrl}/admins/${id}`, {
                            headers: { Authorization: token }
                        });
                    })
                    .then(response => {
                        fillForm(response.data);
                    })
                    .catch(() => {
                        localStorage.clear();
                        window.location.href = "/login.html";
                    });
            } else {
                console.error(error);
                alert("Failed to fetch admin data.");
            }
        });
}

// ----- 7️⃣ دالة لملء الفورم مع الصورة -----
function fillForm(admin: any) {

    avatarPreview.src = admin.avatar_url && admin.avatar_url !== ""
        ? admin.avatar_url
        : "../../assets/imge/avatar_holder_dashboard.gif";

    (document.getElementById("firstName") as HTMLInputElement).value = admin.first_name || "";
    (document.getElementById("lastName") as HTMLInputElement).value = admin.last_name || "";
    (document.getElementById("email") as HTMLInputElement).value = admin.user.email || "";

    const countrySelect = document.getElementById("countryCode") as HTMLSelectElement;
    let phoneCode = admin.user.phone_code || "";
    if (!phoneCode.startsWith("+")) phoneCode = "+" + phoneCode;
    countrySelect.value = phoneCode;

    (document.getElementById("phone") as HTMLInputElement).value = admin.user.phone_number || "";

    // 🔹 صلاحيات الأدمن
    const adminPermissionIds = admin.user.permissions.map((p: any) => p.id);
    const container = document.getElementById("permissionsContainer") as HTMLElement;

    axios.get(apiUrl + "/permissions")
        .then(response => {

            const allPermissions = response.data.permissions;
            container.innerHTML = "";

            for (let i = 0; i < allPermissions.length; i++) {

                const perm = allPermissions[i];

                const col = document.createElement("div");
                col.className = "col-md-3 col-sm-6 mb-2 perm-col";

                const formCheck = document.createElement("div");
                formCheck.className = "form-check perm-check";

                const input = document.createElement("input");
                input.type = "checkbox";
                input.className = "form-check-input perm-input";
                input.value = perm.id.toString();
                input.id = "perm_" + perm.id;

                // ✅ مقارنة صلاحيات الأدمن
                if (adminPermissionIds.includes(perm.id)) {
                    input.checked = true;
                }

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

            updateSelectAllState();
        })
        .catch(error => console.log(error));
}

if (adminId) {
    getAdmin(adminId);
}

// ----- 9️⃣ حفظ التعديلات مع الصورة -----
const submitBtn = document.getElementById("submit-btn");
submitBtn?.addEventListener("click", () => {

    const formData = new FormData();

    formData.append("firstName", (document.getElementById("firstName") as HTMLInputElement).value);
    formData.append("lastName", (document.getElementById("lastName") as HTMLInputElement).value);
    formData.append("email", (document.getElementById("email") as HTMLInputElement).value);
    formData.append("phone_code", (document.getElementById("countryCode") as HTMLSelectElement).value);
    formData.append("phone_number", (document.getElementById("phone") as HTMLInputElement).value);

    if (selectedAvatarFile) {
        formData.append("avatar", selectedAvatarFile);
    }

    const checkedPermissions = document.querySelectorAll<HTMLInputElement>(".perm-input:checked");
    checkedPermissions.forEach(cb => {
        formData.append("permissions[]", cb.value);
    });

    axios.post(`${apiUrl}/admins/${adminId}`, formData, {
        headers: { Authorization: token }
    })
        .then(() => {
            alert("Admin updated successfully!");
            window.location.href = "/admins.html";
        })
        .catch(err => {
            console.log(err.response?.data);
            alert("Failed to update admin.");
        });
});

