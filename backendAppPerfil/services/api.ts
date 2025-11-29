import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // web: localhost, dispositivo: tu IP
  baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  getProfile(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/profile`, { headers });
  }

  uploadPhoto(token: string, imageBase64: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(
      `${this.baseUrl}/profile/photo`,
      { imageBase64 },
      { headers }
    );
  }
}
