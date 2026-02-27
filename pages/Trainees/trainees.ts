import '../../global.scss';
import '../common/sideMenu.scss';
import './trainees.scss';
import '../common/sideMenu';
import axios from "axios";
import { refreshTokenFun } from "../../api/api";

let token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "/login.html";
}

let refreshToken = localStorage.getItem("refreshToken");

const addNewBtn = document.getElementById("addNewBtn");
addNewBtn?.addEventListener("click", () => {
    window.location.href = "trainees-add.html";
});

// ✅ match new HTML
const tbody = document.getElementById("traineesTableBody") as HTMLElement;

// base url
const apiUrl = "http://127.0.0.1:9696";

// endpoint name (trainees/students)
const traineesEndpoint = "/dashboard_students";

// ==== TYPES ====
type Trainee = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_code: string;
    phone_number: string;

    created_at?: string | null;
    updated_at?: string | null;

    created_by_adminName?: string | null;
    updated_by_adminName?: string | null;

    created_by_organizationName?: string | null;
    updated_by_organizationName?: string | null;

    created_by_studentName?: string | null;
    updated_by_studentName?: string | null;
};

// ==== RENDER TABLE ====
function renderTrainees(trainees: Trainee[]) {
    const table = document.querySelector(".trainees-table") as HTMLTableElement;
    if (!table || !tbody) return;

    if (!trainees || trainees.length === 0) {
        table.style.display = "none";
        return;
    } else {
        table.style.display = "table";
    }

    tbody.innerHTML = "";

    for (let i = 0; i < trainees.length; i++) {
        const t = trainees[i];

        const tr = document.createElement("tr");

        // 1) ID
        const id = t.id;
        const td1 = document.createElement("td");
        td1.textContent = id.toString();

        // 2) First name
        const td2 = document.createElement("td");
        td2.textContent = (t.first_name ?? "").toString();

        // 3) Last name
        const td3 = document.createElement("td");
        td3.textContent = (t.last_name ?? "").toString();

        // 4) Email
        const td4 = document.createElement("td");
        td4.textContent = (t.email ?? "").toString();

        // 5) Phone
        const td5 = document.createElement("td");
        td5.textContent = `${t.phone_code ?? ""}-${t.phone_number ?? ""}`;

        // 6) Created at
        const td6 = document.createElement("td");
        td6.textContent = t.created_at && t.created_at !== "" ? t.created_at : "—";

        // 7) Created by (admin -> org -> student)
        const td7 = document.createElement("td");
        const createdBy =
            t.created_by_adminName ||
            t.created_by_organizationName ||
            t.created_by_studentName;
        td7.textContent = createdBy && createdBy !== "" ? createdBy : "—";

        // 8) Updated at
        const td8 = document.createElement("td");
        td8.textContent = t.updated_at && t.updated_at !== "" ? t.updated_at : "—";

        // 9) Updated by (admin -> org -> student)
        const td9 = document.createElement("td");
        const updatedBy =
            t.updated_by_adminName ||
            t.updated_by_organizationName ||
            t.updated_by_studentName;
        td9.textContent = updatedBy && updatedBy !== "" ? updatedBy : "—";

        // 10) Actions
        const td10 = document.createElement("td");
        td10.classList.add("actions-col");
        td10.innerHTML = `
      <div class="actions-wrapper">
        <span class="actions-menu"><i class="fa-solid fa-ellipsis-vertical"></i></span>
        <div class="actions-dropdown">
          <div class="action-item edit">
            <i class="fa-solid fa-pen"></i> Edit
          </div>
          <div class="action-item delete">
            <i class="fa-solid fa-trash"></i> Delete
          </div>
        </div>
      </div>
    `;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        tr.appendChild(td7);
        tr.appendChild(td8);
        tr.appendChild(td9);
        tr.appendChild(td10);

        tbody.appendChild(tr);

        const editBtn = tr.querySelector(".action-item.edit") as HTMLElement;
        editBtn.addEventListener("click", () => {
            window.location.href = `trainees-edit.html?id=${id}`;
        });

        const deleteBtn = tr.querySelector(".action-item.delete") as HTMLElement;
        deleteBtn.addEventListener("click", () => {
            if (!confirm("Delete this trainee?")) return;

            axios
                .delete(`${apiUrl}${traineesEndpoint}/${id}`, {
                    headers: { Authorization: token },
                })
                .then(() => {
                    alert("Deleted successfully");
                    getTrainees(1, "");
                })
                .catch(() => {
                    alert("Failed to delete");
                });
        });
    }
}

// ==== PAGINATION ====
function renderPagination(totalCount: number) {
    const totalPages = Math.ceil(totalCount / 5);

    const btnContainer = document.getElementById("pagination") as HTMLElement;
    if (!btnContainer) return;

    btnContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline-primary";
        btn.innerText = i.toString();
        btn.addEventListener("click", () => {
            window.location.href = `/trainees.html?page=${i}`;
        });

        btnContainer.appendChild(btn);
    }
}

// ==== GET TRAINEES ====
function getTrainees(pageNumber: number = 1, search: string) {
    let apiUrlCall = `${apiUrl}${traineesEndpoint}?page=${pageNumber}`;
    if (search) apiUrlCall += `&search=${encodeURIComponent(search)}`;

    axios
        .get(apiUrlCall, {
            headers: { Authorization: token },
        })
        .then((response) => {
            renderTrainees(response.data.students);
            renderPagination(response.data.totalCount);
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                refreshTokenFun(refreshToken)
                    .then((tokens) => {
                        token = tokens.token;
                        refreshToken = tokens.refreshToken;

                        const retryUrl = `${apiUrl}${traineesEndpoint}?page=${pageNumber}${search ? `&search=${encodeURIComponent(search)}` : ""
                            }`;

                        return axios.get(retryUrl, { headers: { Authorization: token } });
                    })
                    .then((response) => {
                        renderTrainees(response.data.students);
                        renderPagination(response.data.totalCount);
                    })
                    .catch(() => {
                        localStorage.clear();
                        window.location.href = "/login.html";
                    });
            }
        });
}

// ==== INIT LOAD FROM URL PARAMS ====
const urlParams = new URLSearchParams(window.location.search);

const pageParam = urlParams.get("page");
const searchParam = urlParams.get("search") || "";

const page = pageParam ? parseInt(pageParam) : 1;

getTrainees(page, searchParam);

// ==== SEARCH ====
function initSearch() {
    const input = document.querySelector(".search-input") as HTMLInputElement;
    if (!input) return;

    const params = new URLSearchParams(window.location.search);
    const oldSearch = params.get("search");
    if (oldSearch) input.value = oldSearch;

    input.addEventListener("input", () => {
        const value = input.value.trim();

        const newParams = new URLSearchParams(window.location.search);
        newParams.set("search", value);
        newParams.set("page", "1");

        const newUrl = window.location.pathname + "?" + newParams.toString();
        window.history.replaceState(null, "", newUrl);

        getTrainees(1, value);
    });
}

initSearch();
