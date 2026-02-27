import axios from "axios";

export function refreshTokenFun(refreshToken: string) {
    return axios.get("http://127.0.0.1:9696/authentication/refresh-token", {
        headers: {
            Authorization: refreshToken
        }
    })
        .then((response) => {
            const newAccess = response.data.data?.access_token || response.data.access_token;
            const newRefresh = response.data.data?.refresh_token || response.data.refresh_token;

            localStorage.setItem("accessToken", newAccess);
            localStorage.setItem("refreshToken", newRefresh);

            return {
                token: newAccess,
                refreshToken: newRefresh
            };
        });
}
