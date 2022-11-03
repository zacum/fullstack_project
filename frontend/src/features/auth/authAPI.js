import Axios from 'src/libs/axios';

export function signinWithToken() {
  return Axios.post('/users/signinWithToken')
    .then(res => {
      return {
        status: 'success',
        userdata: res.data,
      };
    })
    .catch(error => {
      if (error.response.status === 401) {
        return { status: 'error', message: error.response.data.message };
      }
      return { status: 'error', message: error.message };
    });
}

export function signin(email, password) {
  return Axios.post('/users/authenticate', { email, password });
}

export function signup(userdata) {
  return Axios.post('/users/register', userdata);
}
