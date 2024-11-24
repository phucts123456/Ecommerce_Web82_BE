const axios = require('axios');
const config = require("dotenv").config({ path: ".env" });
const GHN_API_BASE_URL = process.env.GHN_API_BASE_URL;
const GHN_TOKEN = process.env.GHN_TOKEN;

const getGhnApiInstance = () => {
    console.log(GHN_API_BASE_URL)
    return axios.create({
        baseURL: GHN_API_BASE_URL,
        headers: {
            "Content-Type": 'application/json',
            "Token": GHN_TOKEN
        }
    })
}

// axiosClient.interceptors.request.use((config) => {
//     const token = localStorage.getItem("accessToken");
  
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
  
//     return config;
//   });

module.exports = {
    getGhnApiInstance
};