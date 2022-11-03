import axios from 'axios';
import storage, { tokenKey } from 'src/utils/storage';

const Axios = axios.create({
  responseType: 'json',
});

Axios.interceptors.request.use(function (options) {
  const token = storage.get(tokenKey);
  if (token !== null) {
    options.headers.Authorization = 'Bearer ' + token;
  }
  return options;
});

Axios.interceptors.response.use(response => response.data);

export default Axios;
