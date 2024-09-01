import axios from 'axios';
const main_URL = 'http://localhost:5000'
export const publicRequest = axios.create({
    baseURL: main_URL
})