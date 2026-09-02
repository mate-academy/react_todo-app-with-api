import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'https://react-todo-app-with-api.onrender.com',
});
