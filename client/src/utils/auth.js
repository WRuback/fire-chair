import decode from 'jwt-decode';

class AuthService {
  getUser() {
    return decode(this.getToken());
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('id_token');
      localStorage.removeItem('username');
      return true;
    }
    return false;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken.token);
    localStorage.setItem('username',idToken.user.username);  
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('username');
    window.location.reload();
  }
}

export default new AuthService();
