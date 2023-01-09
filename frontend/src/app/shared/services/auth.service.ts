import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environment";
import { User } from "../models/user";
import { lastValueFrom } from "rxjs";
import { Router } from "@angular/router";

export const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  profile: User = {email: '', name: '', isAdmin: false};

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  register(email: string, name: string, password: string): Promise<User> {
    const payload = {email, name, password};
    const response$ = this.httpClient.post<User>(`${environment.apiUrl}/auth/register`, payload);
    return lastValueFrom(response$);
  }

  async login(email: string, password: string): Promise<void> {
    const payload = {email, password};
    const response$ = this.httpClient.post<{ accessToken: string }>(`${environment.apiUrl}/auth/login`, payload);

    const {accessToken} = await lastValueFrom(response$);
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await this.getAndSetProfile();
    this.router.navigateByUrl('/');
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  async getAndSetProfile(): Promise<void> {
    const response$ = this.httpClient.get<User>(`${environment.apiUrl}/auth/profile`);
    this.profile = await lastValueFrom(response$);
  }
}
