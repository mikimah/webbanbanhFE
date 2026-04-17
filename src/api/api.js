import axios from 'axios';

const api = axios.create({
  baseURL: 'https://webbanbanhbe.onrender.com', 
  //baseURL: 'http://127.0.0.1:8000', 
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}
});

export default api;
