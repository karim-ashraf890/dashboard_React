import '../../global.scss';
import '../common/sideMenu.scss';
import './organizations.scss'
import '../common/sideMenu';
import axios from "axios";
import { refreshTokenFun } from "../../api/api";

let token = localStorage.getItem("accessToken");
if (!token) {
    window.location.href = "/login.html";
}

let refreshToken = localStorage.getItem("refreshToken");