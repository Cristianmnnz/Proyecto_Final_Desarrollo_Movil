import { Injectable } from '@angular/core';

export interface User {
  email: string;
  password: string;
  name: string;
  age: number;
  sex: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private USER_KEY = 'user';
  private LOGGED_KEY = 'logged';

  register(user: User) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  login(email: string, password: string): boolean {
    const user = this.getUser();
    if (!user) return false;

    const ok = user.email === email && user.password === password;
    if (ok) localStorage.setItem(this.LOGGED_KEY, 'true');
    return ok;
  }

  isLogged(): boolean {
    return localStorage.getItem(this.LOGGED_KEY) === 'true';
  }

  logout() {
    localStorage.removeItem(this.LOGGED_KEY);
  }
}
