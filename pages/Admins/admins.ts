import '../../global.scss';
import '../common/sideMenu.scss';
import './admins.scss'
import '../common/sideMenu';
import axios from "axios";
import { refreshTokenFun } from "../../api/api";

let token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "/login.html";
}

let refreshToken: any = localStorage.getItem("refreshToken");

const addNewBtn = document.getElementById("addNewBtn") as HTMLElement;

addNewBtn.addEventListener("click", () => {
    window.location.href = "add.html";
});


const tbody = document.getElementById("adminsTableBody") as HTMLElement;

const apiUrl = "http://127.0.0.1:9696";




function renderAdmins(admins: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_code: string;
    phone_number: string;
    created_at?: string | null;
    created_by_adminName?: string | null;
    updated_at?: string | null;
    updated_by_adminName?: string | null;
}[]) {
    const table = document.querySelector(".admins-table") as HTMLTableElement;
    if (!table) return;

    if (!admins || admins.length === 0) {
        table.style.display = "none";
        return;
    } else {
        table.style.display = "table";
    }

    tbody.innerHTML = "";

    for (let i = 0; i < admins.length; i++) {

        const admin = admins[i];

        const tr = document.createElement("tr");

        // 1) ID
        const id = admin.id;
        const td1 = document.createElement("td");
        td1.textContent = admin.id.toString();
        // 2) First name
        let firstName = admin.first_name;
        const td2 = document.createElement("td");
        td2.textContent = firstName;
        // 3) Last name
        let lastName = admin.last_name;
        const td3 = document.createElement("td");
        td3.textContent = lastName;
        // 4) Email
        let email = admin.email;
        const td4 = document.createElement("td");
        td4.textContent = email;
        // 5) Phone number
        let phone = admin.phone_code + "-" + admin.phone_number;
        const td5 = document.createElement("td");
        td5.textContent = phone;
        // 6) Created at
        let createdAt = admin.created_at;

        const td6 = document.createElement("td");

        if (createdAt && createdAt !== "") {
            td6.textContent = createdAt;
        } else {
            td6.textContent = "—";
        }
        // 7) Created by
        let createdBy = admin.created_by_adminName;
        const td7 = document.createElement("td");
        if (createdBy && createdBy !== "") {
            td7.textContent = createdBy;
        } else {
            td7.textContent = "—";
        }
        // 8) Updated at
        let updatedAt = admin.updated_at;
        const td8 = document.createElement("td");
        if (updatedAt && updatedAt !== "") {
            td8.textContent = updatedAt;
        } else {
            td8.textContent = "—";
        }
        // 9) Updated by
        let updatedBy = admin.updated_by_adminName;
        const td9 = document.createElement("td");
        if (updatedBy && updatedBy !== "") {
            td9.textContent = updatedBy;
        } else {
            td9.textContent = "—";
        }
        // 10) Actions column
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

        const editBtn = tr.querySelector('.action-item.edit') as HTMLElement;
        editBtn.addEventListener('click', () => {
            window.location.href = `edit.html?id=${id}`;
        });

        const deleteBtn = tr.querySelector('.action-item.delete') as HTMLElement;
        deleteBtn.addEventListener('click', () => {
            if (!confirm("Delete this admin?")) return;
            axios.delete(`${apiUrl}/admins/${id}`, {
                headers: { Authorization: token }
            })
                .then(() => {
                    alert("Deleted successfully");
                    getAdmins(1, "");
                })
                .catch(() => {
                    alert("Failed to delete");
                });
        });
    }
}

function renderPagination(totalCount: number) {

    const totalPages = Math.ceil(totalCount / 5);

    let btnContainer = document.getElementById("pagination") as HTMLElement;
    btnContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline-primary";
        btn.innerText = i.toString();
        btn.addEventListener("click", function () {
            window.location.href = `/admins.html?page=${i}`;
        });

        btnContainer.appendChild(btn);
    }
}

function getAdmins(pageNumer: number = 1, search: string) {
    let apiUrlCall = `${apiUrl}/admins?page=${pageNumer}`;
    if (search) {
        apiUrlCall += `&search=${search}`
    }
    axios.get(apiUrlCall,
        {
            headers: {
                Authorization: token
            }
        })
        .then((response) => {
            renderAdmins(response.data.admins);
            renderPagination(response.data.totalCount)
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                refreshTokenFun(refreshToken)
                    .then((tokens) => {
                        token = tokens.token;
                        refreshToken = tokens.refreshToken;
                        return axios.get(apiUrl + "/admins?page=1",
                            {
                                headers: {
                                    Authorization: token
                                }
                            });
                    })
                    .then((response) => {
                        renderAdmins(response.data.admins);
                        renderPagination(response.data.totalCount)

                    })
                    .catch((error) => {
                        localStorage.clear();
                        window.location.href = "/login.html";
                    });
            }
        });
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
getAdmins(parseInt(urlParams.get('page') as any), urlParams.get('search') as any);

function initSearch() {

    var input = document.querySelector('.search-input') as HTMLInputElement;
    var params = new URLSearchParams(window.location.search);
    var oldSearch = params.get('search');
    if (oldSearch) {
        input.value = oldSearch;
    }

    input.addEventListener('input', function () {

        var value = input.value.trim();

        var newParams = new URLSearchParams(window.location.search);
        newParams.set('search', value);
        newParams.set('page', '1');

        var newUrl = window.location.pathname + '?' + newParams.toString();
        window.history.replaceState(null, '', newUrl);

        getAdmins(1, value);
    });
}

initSearch();

interface ILaw {
    date: string;
    hitGuy(): any;
}

abstract class BaseLawyer {
    abstract reviewCrime(): any;

    seeData() {
        console.log("Data")
    }
}

class GeneralLawyer extends BaseLawyer implements ILaw {
    date = "koo";
    reviewCrime() {
        console.log("review");
        this.hitGuy();
    }
    seeData(): void {
        super.seeData();

    }
    hitGuy() {

    }
}

class Lawyer {
    name: string | undefined;

    constructor(firstName: string) {
        this.name = firstName;
    }
    // public ,
    // not use from object => protected, private
    reviewCrime() {
        console.log(this.name)
    }
}

class LawyerCars extends Lawyer { //Inheritance
    constructor() {
        super("karim");
    }
}

const lawyerObj = new Lawyer("ahmed"); // create object
const lawyerCarsObj = new LawyerCars();

lawyerObj.reviewCrime();

lawyerCarsObj.reviewCrime();