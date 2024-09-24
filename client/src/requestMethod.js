import axios from 'axios';

const main_URL = import.meta.env.VITE_BASE_URL;

export const publicRequest = axios.create({
    baseURL: main_URL,
});
