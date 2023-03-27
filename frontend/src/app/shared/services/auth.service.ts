import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment";
import {BehaviorSubject, lastValueFrom, map, Observable} from "rxjs";
import {Router} from "@angular/router";
import {Profile} from "../models/profile";
import { HashService } from './hash.service';

export const ACCESS_TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private profileSource$ = new BehaviorSubject({email: '', name: '', isAdmin: false});


  constructor(private httpClient: HttpClient, private router: Router) {
  }


  get profile$(): Observable<Profile> {
    return this.profileSource$.asObservable()
  }

  get isAdmin$(): Observable<boolean> {
    return this.profile$.pipe(
      map((profile) => profile.isAdmin)
    );
  }

  register(email: string, name: string, password: string): Promise<Profile> {
    const payload = {email, name, password};
    const response$ = this.httpClient.post<Profile>(`${environment.apiUrl}/auth/register`, payload);
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

  // This function sends a request to the reset-password endpoint
  // with the email address of the user who is requesting a password reset.
  // The endpoint will then send an email with a link to the user
  // to allow them to reset their password.
  // The function returns a promise that resolves to true if the request was successful.
  async resetPassword(email: string): Promise<boolean> {
    const response = this.httpClient.get<boolean>(`${environment.apiUrl}/auth/reset-password/${email}`);
    return lastValueFrom(response);
  }

  async resetPasswordWithCode(email: string): Promise<boolean> {
    const response = this.httpClient.get<boolean>(`${environment.apiUrl}/auth/reset-password-vcode/${email}`);
    return lastValueFrom(response);
  }

  async setNewPasswordFromResetToken(token: string, newPassword: string) {
    const response = this.httpClient.put(`${environment.apiUrl}/auth/set-password`, {token, newPassword});
    return lastValueFrom(response);
  }

  async checkVerificationCode(code: string): Promise<boolean> {
    const response = this.httpClient.get<boolean>(`${environment.apiUrl}/auth/check-vcode/${code}`);
    return lastValueFrom(response);
  }

  async setNewPasswordFromVerificationCode(code: string, newPassword: string) {
    const response = this.httpClient.put(`${environment.apiUrl}/auth/set-password-vcode`, {code, newPassword});
    return lastValueFrom(response);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/auth/login');
  }

  async getAndSetProfile(): Promise<void> {
    const response$ = this.httpClient.get<Profile>(`${environment.apiUrl}/auth/profile`);
    const profile = await lastValueFrom(response$);
    this.profileSource$.next(profile);
  }

  setProfile(profile: Profile) {
    this.profileSource$.next(profile);
  }
}
